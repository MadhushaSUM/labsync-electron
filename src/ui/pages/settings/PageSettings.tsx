import { Button, Card } from "antd"

const PageSettings = () => {

    const testPDF = async () => {
        const res = await window.electron.report.test();
        if (res.success) {
            alert("Done");
        } else {
            alert("Something went wrong!")
        }
    }

    return (
        <Card
            title="Page Settings"
        >
            <Button
                color="default"
                variant="outlined"
                onClick={() => testPDF()}>
                Test
            </Button>
        </Card>
    )
}

export default PageSettings;