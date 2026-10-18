import os
import re
import json

base_dir = r"d:\APLICATIVO MOVY"
sql_file = os.path.join(base_dir, "BANCO DE DADOS MIGRAR PARA OCEAN", "rota101_2026-10-13_11-00-48.sql")

tables = []
with open(sql_file, "r", encoding="utf-8", errors="ignore") as f:
    for line in f:
        if line.startswith("CREATE TABLE "):
            parts = line.split("`")
            if len(parts) >= 2:
                tables.append(parts[1])

print(f"Total tables: {len(tables)}")
with open(os.path.join(base_dir, "AUDITORIA DO PROJETO COMPLETO PARA RECRIAR TUDO QUE EXISTE DO ZERO", "tables_list.txt"), "w", encoding="utf-8") as out:
    for t in tables:
        out.write(t + "\n")

print("Tables written to tables_list.txt")
