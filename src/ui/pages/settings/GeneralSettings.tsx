import { Card, Collapse, CollapseProps } from "antd"
import { PrinterOutlined, SettingOutlined } from '@ant-design/icons';
import PrinterSettings from "./general-setting-children/printerSettings";


const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const items: CollapseProps['items'] = [
    {
        key: '1',
        label: 'Set preferred printers',
        children: <PrinterSettings />,
        extra: <PrinterOutlined />
    },
    {
        key: '2',
        label: 'This is panel header 2',
        children: <p>{text}</p>,
        extra: <SettingOutlined />
    },
    {
        key: '3',
        label: 'This is panel header 3',
        children: <p>{text}</p>,
        extra: <SettingOutlined />
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