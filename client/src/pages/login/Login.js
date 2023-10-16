import Form from 'react-bootstrap/Form';

function FormGroupExample() {
  return (
    <div className="login-div" style={stylesheet}>
      <Form>
        <Form.Group className="mb-3" controlId="formGroupEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formGroupPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" />
        </Form.Group>
      </Form>
    </div>

  );
}

export default FormGroupExample;

const stylesheet = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  alignContent: "center",
  height: "100vh"
}