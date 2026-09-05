import useOutsideClick from "@/hooks/useOutsideClick";
import { cn } from "@/lib/utils";
import { Check, ChevronDownIcon, ChevronLeft, ChevronRight, DownloadIcon } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";

export interface SelectOption {
  label: string;
  value: string | number;
  period?: "AM" | "PM";
}

export interface FieldLabel {
  exist?: boolean;
  id?: string;
  text?: React.ReactNode;
  style?: string;
}

export interface FloatElement {
  exist?: boolean;
  position?: "left" | "right" | "l" | "r";
  style?: string;
  children?: React.ReactNode;
}

export interface FieldIcon {
  exist?: boolean;
  action?: () => void;
  element?: React.ElementType;
}

export interface FormControlProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "style"> {
  label?: FieldLabel;
  style?: string;
  icon?: FieldIcon;
  floatEle?: FloatElement;
  required?: boolean;
}

export const FormControl = React.forwardRef<HTMLInputElement, FormControlProps>(({
  type = "text",
  label = {},
  style = "",
  icon = {},
  floatEle,
  required = false,
  ...others
}, ref) => {
  return (
    <div className="relative">
      {label?.exist && (
        <label htmlFor={label.id ?? ""} className={cn("block mb-1 text-sm font-medium text-foreground", label?.style)}>
          {label?.text ?? ""}
          {required && <span className="ml-1 text-xs text-secondary">(required)</span>}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          type={type}
          id={label.id ?? ""}
          required={required}
          {...others}
          className={cn(
            "flex min-h-[3rem] w-full rounded-md border border-input bg-background px-3.5 py-2 text-base text-foreground transition-all duration-300 ease-in-out placeholder:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            floatEle?.exist && (["right", "r"].includes(floatEle?.position ?? "") ? "pr-28" : "pl-10"),
            icon?.exist && "pr-12",
            style,
          )}
        />
        {icon?.exist && icon.element && (
          <button
            onClick={icon.action}
            type="button"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full text-muted-foreground hover:bg-muted"
          >
            {React.createElement(icon.element, { className: "w-5 h-5 pointer-events-none" })}
          </button>
        )}
        {floatEle?.exist && (
          <div
            className={cn(
              "absolute top-1/2 -translate-y-1/2 flex items-center justify-center text-sm text-muted-foreground",
              ["right", "r"].includes((floatEle.position ?? "").toLowerCase()) ? "right-3" : "left-3",
              floatEle.style,
            )}
          >
            {floatEle.children}
          </div>
        )}
      </div>
    </div>
  );
});
FormControl.displayName = "FormControl";

export const RadioInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className = "", ...others }) => (
  <input
    type="radio"
    className={cn("w-4 h-4 border cursor-pointer accent-secondary transition duration-300 focus-visible:outline-none", className)}
    {...others}
  />
);

export interface RadioControlProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: FieldLabel;
  wrapperClass?: string;
}

export const RadioControl: React.FC<RadioControlProps> = ({
  label = {},
  className = "",
  wrapperClass = "",
  ...others
}) => {
  return (
    <label className={cn("flex items-center gap-1.5 cursor-pointer", wrapperClass)}>
      <input
        type="radio"
        className={cn(
          "w-4 h-4 border border-input accent-secondary cursor-pointer transition duration-300 focus-visible:outline-none",
          className,
        )}
        {...others}
      />

      {label?.exist && <span className={cn("text-sm text-foreground/80", label?.style)}>{label?.text ?? ""}</span>}
    </label>
  );
};

export interface SwitchInputProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isOn: boolean;
}

export const SwitchInput: React.FC<SwitchInputProps> = ({ className = "", isOn, ...others }) => (
  <button
    type="button"
    {...others}
    className={cn(
      "relative inline-flex items-center h-[20px] w-[40px] rounded-full transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-60",
      isOn ? "bg-success" : "bg-muted",
      className,
    )}
  >
    <span
      className={cn(
        "inline-block w-[16px] h-[16px] bg-background rounded-full shadow-md transform transition-transform",
        isOn ? "translate-x-[22px]" : "translate-x-[2px]",
      )}
    />
  </button>
);

export interface CheckBoxControlProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: FieldLabel;
  wrapperClass?: string;
}

export const CheckBoxControl: React.FC<CheckBoxControlProps> = ({
  label = {},
  className = "",
  wrapperClass = "",
  ...others
}) => {
  return (
    <label className={cn("flex items-start gap-2 cursor-pointer", wrapperClass)}>
      <input
        type="checkbox"
        className={cn(
          "mt-[2px] h-[1.15rem] w-[1.15rem] rounded-md border-2 border-input checked:accent-primary cursor-pointer transition-all duration-300",
          className,
        )}
        {...others}
      />

      {label?.exist && (
        <span className={cn("text-sm leading-relaxed text-foreground/80", label?.style)}>{label?.text}</span>
      )}
    </label>
  );
};

export interface FileUploadProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "id" | "className" | "type" | "style"> {
  id: string;
  label: React.ReactNode;
  hint?: React.ReactNode;
  icon?: React.ElementType;
  style?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ id, label, hint, icon: Icon = DownloadIcon, style = "", ...others }) => (
  <div className="w-full">
    <label
      htmlFor={id}
      className={cn(
        "flex flex-col items-center justify-center gap-2 p-6 bg-muted/40 border-2 border-dashed border-input rounded-lg cursor-pointer hover:bg-muted transition-colors",
        others.disabled && "cursor-not-allowed opacity-50 hover:bg-muted/40",
        style,
      )}
    >
      <Icon className="w-6 h-6 text-muted-foreground" />
      <span className="text-sm font-medium text-foreground">{label}</span>
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      <input type="file" id={id} className="sr-only" {...others} />
    </label>
  </div>
);

export interface SelectBoxProps {
  label?: React.ReactNode;
  placeholder?: string;
  options?: SelectOption[];
  value?: SelectOption | null;
  onChange?: (option: SelectOption) => void;
}

export const SelectBox: React.FC<SelectBoxProps> = ({
  label,
  placeholder = "Select an option",
  options = [],
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<SelectOption | null>(value ?? null);
  const boxRef = useRef<HTMLDivElement>(null);

  useOutsideClick(boxRef, () => setIsOpen(false), isOpen);

  const handleSelect = (option: SelectOption) => {
    setSelected(option);
    setIsOpen(false);
    onChange?.(option);
  };

  return (
    <div className="relative w-full" ref={boxRef}>
      {label && <label className="block mb-1 text-base font-normal text-foreground">{label}</label>}

      <div
        className="flex items-center justify-between w-full px-3.5 py-2 min-h-[3rem] bg-background hover:bg-muted border border-input rounded cursor-pointer"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className={cn("block truncate text-base", selected ? "text-foreground" : "text-muted-foreground text-sm")}>
          {selected?.label || placeholder}
        </span>

        <ChevronDownIcon className="w-5 h-5 text-muted-foreground" />
      </div>

      {isOpen && (
        <ul className="absolute z-50 w-full mt-2 max-h-32 overflow-y-auto bg-popover border border-border rounded-lg shadow-sm">
          {options.map((opt, index) => (
            <li
              key={index}
              onClick={() => handleSelect(opt)}
              className="flex justify-between px-4 py-2 text-sm text-foreground cursor-pointer hover:bg-muted"
            >
              {opt.label}
              {selected?.value === opt.value && <Check className="w-5 h-5 text-secondary" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export interface SelectBoxControlProps {
  label?: FieldLabel;
  placeholder?: string;
  options?: SelectOption[];
  value?: SelectOption | null;
  onChange?: (option: SelectOption) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  style?: string;
}

export const SelectBoxControl: React.FC<SelectBoxControlProps> = ({
  label = {},
  placeholder = "Select an option",
  options = [],
  value,
  onChange,
  required = false,
  disabled = false,
  error,
  style = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const selected = value ?? null;

  useOutsideClick(boxRef, () => setIsOpen(false), isOpen);

  const handleSelect = (option: SelectOption) => {
    setIsOpen(false);
    onChange?.(option);
  };

  return (
    <div className="relative" ref={boxRef}>
      {label?.exist && (
        <label className={cn("block mb-1 text-sm font-medium text-foreground", label?.style)}>
          {label?.text ?? ""}
          {required && <span className="ml-1 text-xs text-secondary">(required)</span>}
        </label>
      )}

      <div
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={cn(
          "flex items-center justify-between px-3.5 py-2 min-h-[3rem] w-full text-base bg-background border border-input rounded cursor-pointer transition-all duration-300 ease-in-out hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring",
          disabled && "cursor-not-allowed opacity-50 hover:bg-background",
          error && "border-destructive",
          style,
        )}
      >
        <span className={cn("block truncate", selected ? "text-foreground" : "text-muted-foreground text-sm")}>
          {selected?.label || placeholder}
        </span>

        <ChevronDownIcon className="w-5 h-5 text-muted-foreground" />
      </div>

      {required && (
        <input
          tabIndex={-1}
          autoComplete="off"
          className="absolute opacity-0 pointer-events-none"
          value={selected?.value ?? ""}
          required
          onChange={() => {}}
        />
      )}

      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}

      {isOpen && !disabled && (
        <ul className="absolute z-50 min-w-full w-max max-w-[16rem] mt-2 overflow-y-auto border rounded-lg shadow-sm max-h-40 bg-popover border-border">
          {options.map((opt, index) => (
            <li
              key={index}
              onClick={() => handleSelect(opt)}
              className="flex items-center justify-between px-4 py-2 text-sm text-foreground cursor-pointer hover:bg-muted"
            >
              {opt.label}

              {selected?.value === opt.value && <Check className="w-5 h-5 text-secondary" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export interface TextareaControlProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "style"> {
  label?: FieldLabel;
  style?: string;
  required?: boolean;
}

export const TextareaControl: React.FC<TextareaControlProps> = ({
  label = {},
  style = "",
  required = false,
  ...others
}) => (
  <div className="relative">
    {label?.exist && (
      <label htmlFor={label.id ?? ""} className={cn("block mb-1 text-sm font-medium text-foreground", label?.style)}>
        {label?.text ?? ""}
        {required && <span className="ml-1 text-xs text-secondary">(required)</span>}
      </label>
    )}

    <textarea
      id={label.id ?? ""}
      required={required}
      {...others}
      className={cn(
        "w-full min-h-[6rem] resize-none rounded-md border border-input bg-background px-3.5 py-3 text-base text-foreground transition-all duration-300 ease-in-out placeholder:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        style,
      )}
    />
  </div>
);

export interface SelectBoxControlTimeProps {
  label?: FieldLabel;
  placeholder?: string;
  options?: SelectOption[];
  value?: SelectOption | null;
  onChange?: (option: SelectOption) => void;
  required?: boolean;
}

export const SelectBoxControlTime: React.FC<SelectBoxControlTimeProps> = ({
  label = {},
  placeholder = "Select an option",
  options = [],
  value,
  onChange,
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<SelectOption | null>(value ?? null);
  const [period, setPeriod] = useState<"AM" | "PM">(() => {
    const txt = (value?.label ?? "").toUpperCase();
    if (txt.includes("PM")) return "PM";
    return "AM";
  });

  const boxRef = useRef<HTMLDivElement>(null);
  useOutsideClick(boxRef, () => setIsOpen(false), isOpen);

  const hasPeriod = useMemo(() => options.some((o) => o?.period === "AM" || o?.period === "PM"), [options]);

  const visibleOptions = useMemo(() => {
    if (!hasPeriod) return options;
    return options.filter((o) => (o?.period ?? "AM") === period);
  }, [options, hasPeriod, period]);

  const handleSelect = (option: SelectOption) => {
    setSelected(option);
    setIsOpen(false);
    onChange?.(option);
  };

  return (
    <div className="relative" ref={boxRef}>
      {label?.exist && (
        <label className={cn("block mb-2 text-sm font-medium text-foreground", label?.style)}>
          {label?.text ?? ""}
          {required && <span className="ml-1 text-xs text-secondary">(Required)</span>}
        </label>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-between px-3.5 py-2 min-h-[3rem] w-full text-base bg-background border border-input rounded cursor-pointer transition-all duration-300 ease-in-out hover:bg-muted"
      >
        <span className={cn("block truncate text-left", selected ? "text-foreground" : "text-muted-foreground text-sm")}>
          {selected?.label || placeholder}
        </span>

        <ChevronDownIcon className={cn("w-5 h-5 text-muted-foreground transition", isOpen ? "rotate-180" : "rotate-0")} />
      </button>

      {required && (
        <input
          tabIndex={-1}
          autoComplete="off"
          className="absolute opacity-0 pointer-events-none"
          value={selected?.value ?? ""}
          required
          onChange={() => {}}
        />
      )}

      {isOpen && (
        <div className="absolute z-50 w-full mt-3 rounded-2xl border border-border bg-popover shadow-lg p-4">
          {hasPeriod && (
            <div className="mb-4">
              <div className="flex w-full h-12 gap-2 p-1 rounded-full bg-muted">
                <button
                  type="button"
                  onClick={() => setPeriod("AM")}
                  className={cn(
                    "flex-1 rounded-full rounded-tr-none rounded-br-none font-semibold transition",
                    period === "AM" ? "bg-secondary text-secondary-foreground" : "text-foreground/80 bg-secondary/30",
                  )}
                >
                  AM
                </button>
                <button
                  type="button"
                  onClick={() => setPeriod("PM")}
                  className={cn(
                    "flex-1 rounded-full rounded-tl-none rounded-bl-none font-semibold transition",
                    period === "PM" ? "bg-secondary text-secondary-foreground" : "text-foreground/80 bg-secondary/30",
                  )}
                >
                  PM
                </button>
              </div>
            </div>
          )}

          <div className="pr-1 overflow-y-auto max-h-40">
            <div className="grid grid-cols-2 gap-4">
              {visibleOptions.map((opt, index) => {
                const active = selected?.value === opt.value;

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSelect(opt)}
                    className={cn(
                      "h-14 rounded-xl border transition hover:bg-muted flex items-center justify-center font-semibold",
                      active ? "border-ring bg-muted text-foreground" : "border-input text-foreground/90 hover:border-ring/40",
                    )}
                  >
                    <span className="text-base">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export interface SelectBoxControlDurationProps {
  label?: FieldLabel;
  placeholder?: string;
  options?: SelectOption[];
  value?: SelectOption | null;
  onChange?: (option: SelectOption) => void;
  required?: boolean;
  cols?: 2 | 3;
  maxHeight?: string;
}

export const SelectBoxControlDuration: React.FC<SelectBoxControlDurationProps> = ({
  label = {},
  placeholder = "Select Duration",
  options = [],
  value,
  onChange,
  required = false,
  cols = 2,
  maxHeight = "max-h-40",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<SelectOption | null>(value ?? null);

  const boxRef = useRef<HTMLDivElement>(null);
  useOutsideClick(boxRef, () => setIsOpen(false), isOpen);

  const handleSelect = (option: SelectOption) => {
    setSelected(option);
    setIsOpen(false);
    onChange?.(option);
  };

  useEffect(() => {
    if (value?.value !== selected?.value) setSelected(value ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className="relative" ref={boxRef}>
      {label?.exist && (
        <label className={cn("block mb-2 text-sm font-medium text-foreground", label?.style)}>
          {label?.text ?? ""}
          {required && <span className="ml-1 text-xs text-secondary">(Required)</span>}
        </label>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-between px-3.5 py-2 min-h-[3rem] w-full text-base bg-background border border-input rounded cursor-pointer transition-all duration-300 ease-in-out hover:bg-muted"
      >
        <span className={cn("block truncate text-left", selected ? "text-foreground" : "text-muted-foreground text-sm")}>
          {selected?.label || placeholder}
        </span>

        <ChevronDownIcon className={cn("w-5 h-5 text-muted-foreground transition", isOpen ? "rotate-180" : "rotate-0")} />
      </button>

      {required && (
        <input
          tabIndex={-1}
          autoComplete="off"
          className="absolute opacity-0 pointer-events-none"
          value={selected?.value ?? ""}
          required
          onChange={() => {}}
        />
      )}

      {isOpen && (
        <div className="absolute z-50 w-full mt-3 rounded-2xl border border-border bg-popover shadow-lg p-4">
          <div className={cn("pr-1 overflow-y-auto", maxHeight)}>
            <div className={cn("grid gap-4", cols === 3 ? "grid-cols-3" : "grid-cols-2")}>
              {options.map((opt, index) => {
                const active = selected?.value === opt.value;

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSelect(opt)}
                    className={cn(
                      "h-14 rounded-xl border transition hover:bg-muted flex items-center justify-center font-semibold",
                      active ? "border-ring bg-muted text-foreground shadow-[0_0_0_3px_hsl(var(--ring)/0.15)]" : "border-input text-foreground/90 hover:border-ring/40",
                    )}
                  >
                    <span className="text-base">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const pad = (n: number) => String(n).padStart(2, "0");
const toISO = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const sameDay = (a: Date | null, b: Date | null) =>
  !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
const endOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0);
const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, 1);

const daysShort = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];

export interface SelectBoxControlDateProps {
  label?: FieldLabel;
  placeholder?: string;
  value?: string;
  onChange?: (iso: string) => void;
  required?: boolean;
  minDateDaysAhead?: number;
}

export const SelectBoxControlDate: React.FC<SelectBoxControlDateProps> = ({
  label = {},
  placeholder = "Select date",
  value,
  onChange,
  required = false,
  minDateDaysAhead = 0,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const minSelectableDate = useMemo(() => {
    const now = new Date();
    const d = new Date(now);
    d.setDate(d.getDate() + minDateDaysAhead);
    return startOfDay(d);
  }, [minDateDaysAhead]);

  const isDisabled = (d: Date | null) => {
    if (!d) return true;
    return startOfDay(d) < minSelectableDate;
  };

  const selectedDate = useMemo(() => {
    if (!value) return null;
    const [y, m, d] = String(value).split("-").map(Number);
    if (!y || !m || !d) return null;
    return new Date(y, m - 1, d);
  }, [value]);

  const [viewDate, setViewDate] = useState<Date>(() => selectedDate ?? new Date());

  useEffect(() => {
    if (selectedDate) setViewDate(startOfMonth(selectedDate));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const boxRef = useRef<HTMLDivElement>(null);
  useOutsideClick(boxRef, () => setIsOpen(false), isOpen);

  const monthTitle = useMemo(() => viewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" }), [viewDate]);

  const calendarCells = useMemo(() => {
    const start = startOfMonth(viewDate);
    const end = endOfMonth(viewDate);

    const firstDow = start.getDay();
    const totalDays = end.getDate();

    const cells: (Date | null)[] = [];

    for (let i = 0; i < firstDow; i++) cells.push(null);
    for (let day = 1; day <= totalDays; day++) cells.push(new Date(viewDate.getFullYear(), viewDate.getMonth(), day));
    while (cells.length % 7 !== 0) cells.push(null);

    return cells;
  }, [viewDate]);

  const displayValue = useMemo(() => {
    if (!selectedDate) return "";
    return selectedDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  }, [selectedDate]);

  const pick = (d: Date | null) => {
    if (!d) return;
    if (isDisabled(d)) return;
    const iso = toISO(d);
    onChange?.(iso);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={boxRef}>
      {label?.exist && (
        <label className={cn("block mb-2 text-sm font-medium text-foreground", label?.style)}>
          {label?.text ?? ""}
          {required && <span className="ml-1 text-xs text-secondary">(Required)</span>}
        </label>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((p) => !p)}
        className="flex items-center justify-between px-3.5 py-2 min-h-[3rem] w-full text-base bg-background border border-input rounded cursor-pointer transition-all duration-300 ease-in-out hover:bg-muted"
      >
        <span className={cn("block truncate text-left", value ? "text-foreground" : "text-muted-foreground")}>
          {value ? displayValue : placeholder}
        </span>

        <ChevronDownIcon className={cn("w-5 h-5 text-muted-foreground transition", isOpen ? "rotate-180" : "rotate-0")} />
      </button>

      {required && (
        <input
          tabIndex={-1}
          autoComplete="off"
          className="absolute opacity-0 pointer-events-none"
          value={value ?? ""}
          required
          onChange={() => {}}
        />
      )}

      {isOpen && (
        <div className="absolute z-50 w-full mt-3 rounded-2xl border border-border bg-popover shadow-lg p-5">
          <div className="relative flex items-center justify-center mb-5">
            <button
              type="button"
              onClick={() => setViewDate((d) => addMonths(d, -1))}
              className="absolute left-0 flex items-center justify-center w-10 h-10 rounded-full bg-muted hover:bg-muted/70"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>

            <div className="text-lg font-semibold text-foreground">{monthTitle}</div>

            <button
              type="button"
              onClick={() => setViewDate((d) => addMonths(d, 1))}
              className="absolute right-0 flex items-center justify-center w-10 h-10 rounded-full bg-muted hover:bg-muted/70"
              aria-label="Next month"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
          </div>

          <div className="grid grid-cols-7 mb-3">
            {daysShort.map((d) => (
              <div key={d} className="text-sm font-semibold text-center text-foreground/90">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-4">
            {calendarCells.map((d, idx) => {
              const selected = d && selectedDate && sameDay(d, selectedDate);
              const disabled = isDisabled(d);

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={!d || disabled}
                  onClick={() => pick(d)}
                  className={cn(
                    "h-12 w-12 mx-auto rounded-full flex items-center justify-center transition",
                    !d && "opacity-0 pointer-events-none",
                    disabled ? "text-foreground/25 cursor-not-allowed" : "text-foreground hover:bg-muted",
                    selected && "bg-secondary !text-secondary-foreground",
                  )}
                >
                  {d ? d.getDate() : ""}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
