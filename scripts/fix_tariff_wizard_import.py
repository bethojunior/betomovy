path = r'mobilidade-monitor-new-main/src/pages/Advanced/Configs/Tariffs/TypesTravels/components/TariffWizard/index.tsx'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if 'AiOutlineInfoCircle, Switch, Radio, Select as SelectAntd, Checkbox } from "antd"' in line or 'AiOutlineInfoCircle, Switch, Radio, Select as SelectAntd, Checkbox } from \'antd\'' in line:
        new_lines.append('import { Switch, Radio, Select as SelectAntd, Checkbox } from "antd";\n')
    elif 'AiOutlinePlus,' in line and 'react-icons/ai' not in line:
        new_lines.append('  AiOutlinePlus,\n')
        new_lines.append('  AiOutlineInfoCircle,\n')
    else:
        new_lines.append(line)

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Import fixed successfully!")
