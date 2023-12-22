"use client";
import React, { useEffect, useRef, useState } from "react";

interface MaskedInputProps {
  mask: String;
  register: any;
  isLoading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void;
}

const MaskedInput: React.FC<MaskedInputProps> = ({
  mask,
  register,
  isLoading,
  onChange,
}) => {
  const maskArray = mask.split("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Initialize the refs array
  useEffect(() => {
    inputRefs.current = maskArray
      .filter((char) => char === "@")
      .map((_) => null);
  }, [mask, maskArray]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    currentInputIndex: number
  ) => {
    onChange(event, currentInputIndex);

    if (
      event.target.value.length === 1 &&
      currentInputIndex < inputRefs.current.length - 1
    ) {
      inputRefs.current[currentInputIndex + 1]?.focus();
    }
  };

  return (
    <div
      className={`flex items-center justify-evenly text-xl border-2 border-gold-500 rounded-md px-2 py-1.5 w-[30rem]`}
    >
      {maskArray.map((char, index) => {
        if (char === "*") {
          return (
            <label key={index} className="text-[2rem] mb-[-10px]">
              *
            </label>
          );
        } else if (char === "@") {
          const refIndex = maskArray
            .slice(0, index)
            .filter((char) => char === "@").length;
          return (
            <input
              key={index}
              type="password"
              maxLength={1}
              disabled={isLoading}
              ref={(el) => (inputRefs.current[refIndex] = el)}
              {...register(`input-${refIndex}`, {
                required: "This field is required",
                maxLength: 1,
              })}
              onChange={(e) => handleInputChange(e, refIndex)}
              className="block w-7 h-11 rounded-md border-0 py-3.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gold-500 placeholder:text-gold-500 focus:ring-2 focus:ring-inset focus:ring-black sm:text-xl sm:leading-6"
            />
          );
        }
        return null;
      })}
    </div>
  );
};

export default MaskedInput;
