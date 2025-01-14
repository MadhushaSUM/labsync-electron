import { Card, Collapse, CollapseProps } from "antd"
import { CalendarOutlined, PrinterOutlined } from '@ant-design/icons';
import PrinterSettings from "./general-setting-children/printerSettings";
import AgeFormatSettings from "./general-setting-children/ageFormatSettings";


const items: CollapseProps['items'] = [
    {
        key: '1',
        label: 'Set preferred printers',
        children: <PrinterSettings />,
        extra: <PrinterOutlined />
    },
    {
        key: '2',
        label: 'Set preferred age format',
        children: <AgeFormatSettings />,
        extra: <CalendarOutlined />
    },
];

const GeneralSettings = () => {

    return (
        <Card
            title="General Settings"
        >
            <div>
                <Collapse items={items} />
            </div>
        </Card>
    )
}

export default GeneralSettings;