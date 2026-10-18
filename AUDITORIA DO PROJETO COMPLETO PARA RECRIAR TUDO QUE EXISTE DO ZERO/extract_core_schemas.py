import os
import re

sql_file = r"d:\APLICATIVO MOVY\BANCO DE DADOS MIGRAR PARA OCEAN\rota101_2026-10-13_11-00-48.sql"
target_tables = [
    "trip", "driver", "customer", "car", "balance", "balanceFlow", 
    "central", "city", "cityConfig", "config", "address", 
    "tripDiscountCoupon", "userDiscountCoupon", "rating", "cancellationReasons"
]

current_table = None
table_defs = {}

with open(sql_file, "r", encoding="utf-8", errors="ignore") as f:
    for line in f:
        if line.startswith("CREATE TABLE "):
            parts = line.split("`")
            if len(parts) >= 2:
                name = parts[1]
                if name in target_tables:
                    current_table = name
                    table_defs[name] = [line]
                else:
                    current_table = None
        elif current_table:
            table_defs[current_table].append(line)
            if line.startswith(") ENGINE"):
                current_table = None

out_file = r"d:\APLICATIVO MOVY\AUDITORIA DO PROJETO COMPLETO PARA RECRIAR TUDO QUE EXISTE DO ZERO\core_tables_schema.txt"
with open(out_file, "w", encoding="utf-8") as out:
    for t, lines in table_defs.items():
        out.write(f"=== TABELA: {t} ===\n")
        out.write("".join(lines))
        out.write("\n\n")

print(f"Extracted {len(table_defs)} core tables definitions to {out_file}")
