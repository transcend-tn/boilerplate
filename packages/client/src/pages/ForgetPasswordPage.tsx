import React from 'react';
import Form from 'react-bootstrap/esm/Form';
import Button from 'react-bootstrap/esm/Button';
import Card from 'react-bootstrap/esm/Card';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

function ForgetPasswordPage() {
  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('This field is required !'),
    }),
    onSubmit: () => {
      console.log(formik.values.email);
    },
  });

  return (
    <Card bg="#fff" text="dark" className="w-50">
      <Card.Body>
        <h4 className="text-center">Recuperation Mot de Passe</h4>
        <hr />
        <form onSubmit={formik.handleSubmit}>
          <Form.Group controlId="formBasicUsername">
            <Form.Label>Email</Form.Label>
            <Form.Control
              name="email"
              type="email"
              placeholder="Enter Your E-Mail"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email ? (
              <Form.Text className="text-danger">{formik.errors.email}</Form.Text>
            ) : null}
          </Form.Group>
          <Button type="submit" variant="primary" size="lg" block>
            Envoyer
          </Button>
          <div className="d-flex justify-content-around mt-3">
            <Link to="/">Accueil</Link>
          </div>
        </form>
      </Card.Body>
    </Card>
  );
}

export default ForgetPasswordPage;
