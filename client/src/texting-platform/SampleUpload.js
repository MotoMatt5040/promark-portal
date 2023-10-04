import Accordion from 'react-bootstrap/Accordion';

function SampleUpload() {
    return (
        <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
                <Accordion.Header>Sample 1</Accordion.Header>
                <Accordion.Body>
                    Uploaded data for sample 1
                </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
                <Accordion.Header>Sample 2</Accordion.Header>
                <Accordion.Body>
                    Uploaded data for sample 2
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    )
}

export default SampleUpload;
