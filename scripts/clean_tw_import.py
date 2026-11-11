path = r'mobilidade-monitor-new-main/src/pages/Advanced/Configs/Tariffs/TypesTravels/components/TariffWizard/index.tsx'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('import React, { Fragment } from "react";\nimport {\nimport { Switch, Radio, Select as SelectAntd, Checkbox } from "antd";', 'import React, { Fragment } from "react";\nimport { Switch, Radio, Select as SelectAntd, Checkbox } from "antd";')
text = text.replace('import React, { Fragment } from "react";\r\nimport {\r\nimport { Switch, Radio, Select as SelectAntd, Checkbox } from "antd";', 'import React, { Fragment } from "react";\r\nimport { Switch, Radio, Select as SelectAntd, Checkbox } from "antd";')

with open(path, 'w', encoding='utf-8') as f:
    f.write(text)

print("Cleaned import successfully!")
