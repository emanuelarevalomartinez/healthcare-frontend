"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CircleCheck, Loader2 } from "lucide-react";

export interface SearchSelectDisplayField<T> {
  key: keyof T;
  label: string;
  getValue: (item: T) => React.ReactNode;
  condition?: (item: T) => boolean;
}

export interface FormFieldSearchSelectProps<T> {
  id: string;
  label: string;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSelect: (item: T) => void;
  searchItems?: (query: string) => Promise<T[]>;
  getDisplayLabel?: (item: T) => string;
  displayFields?: SearchSelectDisplayField<T>[];
  minChars?: number;
  debounceDelay?: number;
  maxResults?: number;
}

export function FormFieldSearchSelect<T>({
  id,
  label,
  error,
  disabled,
  placeholder,
  value,
  onChange,
  onSelect,
  searchItems,
  getDisplayLabel,
  displayFields = [],
  minChars = 1,
  debounceDelay = 200,
  maxResults = 10,
}: FormFieldSearchSelectProps<T>) {
  const [searchTerm, setSearchTerm] = useState<string>(value || "");
  const [results, setResults] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [isSelecting, setIsSelecting] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const [shouldKeepClosed, setShouldKeepClosed] = useState<boolean>(false);

  const performSearch = useCallback(
    async (query: string): Promise<void> => {
      if (isSelecting || shouldKeepClosed) {
        return;
      }

      if (!query || query.length < minChars) {
        setResults([]);
        setShowDropdown(false);
        return;
      }

      try {
        setIsLoading(true);
        if (searchItems) {
          const searchResults = await searchItems(query);
          const limitedResults = searchResults.slice(0, maxResults);
          setResults(limitedResults);
          setShowDropdown(limitedResults.length > 0);
        }
      } catch (error) {
        console.error("Error searching:", error);
        setResults([]);
        setShowDropdown(false);
      } finally {
        setIsLoading(false);
      }
    },
    [minChars, maxResults, searchItems, isSelecting, shouldKeepClosed]
  );

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      performSearch(searchTerm);
    }, debounceDelay);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchTerm, performSearch, debounceDelay]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const hasSelectedItem =
    selectedItem !== null && !showDropdown && !isSelecting;

  const handleSelectItem = (item: T): void => {
    setIsSelecting(false);
    setShouldKeepClosed(true);

    setSelectedItem(item);

    const displayLabel = getDisplayLabel ? getDisplayLabel(item) : String(item);

    setSearchTerm(displayLabel);
    onChange(displayLabel);

    setResults([]);
    setShowDropdown(false);

    onSelect(item);

    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newValue = e.target.value;

    setSearchTerm(newValue);
    onChange(newValue);

    if (newValue === "") {
      setSelectedItem(null);
      setResults([]);
      setShowDropdown(false);
      setShouldKeepClosed(false);
    } else {
      setShouldKeepClosed(false);
      setIsSelecting(false);
    }
  };

  const handleInputFocus = (): void => {
    if (
      !isSelecting &&
      !shouldKeepClosed &&
      results.length > 0 &&
      searchTerm.length >= minChars
    ) {
      setShowDropdown(true);
    }
  };

  return (
    <div className="flex flex-col gap-y-2" ref={dropdownRef}>
      <Label htmlFor={id}>{label}</Label>

      <div className="relative w-full">
        <div className="relative flex items-center">
          <Input
            ref={inputRef}
            id={id}
            type="text"
            placeholder={placeholder}
            disabled={disabled}
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            aria-invalid={error ? "true" : "false"}
            className={`w-full pr-10 ${
              hasSelectedItem ? "border-blue-500" : ""
            }`}
          />

          {hasSelectedItem && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <CircleCheck className="h-5 w-5 text-blue-500" />
            </div>
          )}

          {isLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
            </div>
          )}
        </div>

        {showDropdown && results.length > 0 && !isSelecting && (
          <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto">
            {results.map((item, index) => (
              <li
                key={index}
                onClick={() => handleSelectItem(item)}
                className="px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors"
              >
                <div className="flex flex-col gap-1">
                  {displayFields.map((field) => {
                    if (field.condition && !field.condition(item)) {
                      return null;
                    }

                    const fieldValue = field.getValue(item);

                    if (
                      fieldValue === undefined ||
                      fieldValue === null ||
                      fieldValue === ""
                    ) {
                      return null;
                    }

                    return (
                      <div
                        key={String(field.key)}
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {fieldValue}
                        </span>

                        <span className="text-xs text-gray-400">
                          {field.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="text-sm h-5 text-red-500">
        {error ? error : <>&nbsp;</>}
      </div>
    </div>
  );
}
