import React from "react";
import Mask from "../../../../../../../services/Mask";
import { MoneyValueTypeInputProps } from "./types";

export function MoneyValueTypeInput({
  label,
  value,
  onChangeValue,
  valueType,
  onChangeType,
  inputType = "text",
  autoComplete,
}: MoneyValueTypeInputProps) {
  const isPercent = valueType !== "$";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        padding: "0.75rem 1rem",
        borderRadius: "12px",
        background: "#F8FAFC",
        border: "1px solid #E2E8F0",
        marginBottom: "0.75rem",
        transition: "all 0.2s ease",
      }}
    >
      <div
        style={{
          minWidth: "180px",
          maxWidth: "260px",
          fontSize: "13px",
          fontWeight: 700,
          color: "#1E293B",
          letterSpacing: "0.3px",
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          flex: "1 1 auto",
          maxWidth: "340px",
          justifyContent: "flex-end",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "160px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span
            style={{
              position: "absolute",
              left: "12px",
              fontSize: "13px",
              fontWeight: 700,
              color: "#94A3B8",
              pointerEvents: "none",
            }}
          >
            {isPercent ? "%" : "R$"}
          </span>
          <input
            type={inputType}
            autoComplete={autoComplete}
            value={value}
            onChange={(event) =>
              onChangeValue(Mask.setMaskMoney(event.target.value))
            }
            style={{
              width: "100%",
              height: "40px",
              paddingLeft: "36px",
              paddingRight: "12px",
              borderRadius: "8px",
              border: "1.5px solid #CBD5E1",
              fontSize: "14px",
              fontWeight: 700,
              color: "#0F172A",
              background: "#FFFFFF",
              outline: "none",
              textAlign: "right",
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#00349A";
              e.target.style.boxShadow = "0 0 0 3px rgba(0, 52, 154, 0.12)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#CBD5E1";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>

        {/* Segmented Button for % and $ */}
        <div
          style={{
            display: "inline-flex",
            background: "#E2E8F0",
            borderRadius: "8px",
            padding: "2px",
          }}
        >
          <button
            type="button"
            onClick={() => onChangeType("%")}
            style={{
              border: "none",
              background: isPercent ? "#00349A" : "transparent",
              color: isPercent ? "#FFFFFF" : "#64748B",
              fontWeight: 700,
              fontSize: "13px",
              padding: "6px 12px",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            %
          </button>
          <button
            type="button"
            onClick={() => onChangeType("$")}
            style={{
              border: "none",
              background: !isPercent ? "#00349A" : "transparent",
              color: !isPercent ? "#FFFFFF" : "#64748B",
              fontWeight: 700,
              fontSize: "13px",
              padding: "6px 12px",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            $
          </button>
        </div>
      </div>
    </div>
  );
}
