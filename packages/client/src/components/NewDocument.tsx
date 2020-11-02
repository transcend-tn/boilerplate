import { EditorState } from 'draft-js';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import Card from 'react-bootstrap/esm/Card';
import Form from 'react-bootstrap/esm/Form';
import { Editor } from 'react-draft-wysiwyg';
import { MutateFunction } from 'react-query';
import * as Yup from 'yup';
import { DocumentCreate } from '@tr/common';
import { useHistory } from 'react-router-dom';

const EDITOR_OPTIONS = [
  'history',
  'inline',
  'blockType',
  'fontSize',
  'colorPicker',
  'textAlign',
  'list',
  'link',
  'emoji',
];

export interface NewDocumentInterface {
  isLoading: boolean;
  createDocument: MutateFunction<string, unknown, any, unknown>;
  docId: string;
}

const NewDocument = (props: NewDocumentInterface) => {
  const history = useHistory();
  const { isLoading, createDocument, docId } = props;
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const formik = useFormik({
    initialValues: {
      title: '',
      body: '',
      owner: '',
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
    }),
    onSubmit: (values: DocumentCreate) => {
      createDocument({
        body: editorState.getCurrentContent(),
        title: values.title,
      }).then(
        (values) =>{
          history.push(`/document/${docId}`);
        },
        (error) => {
          console.log('error !!!');
        },      
      );
      setEditorState(EditorState.createEmpty());
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="mt-5">
      <Form.Group controlId="formBasicOldPassword">
        <Form.Control
          name="title"
          type="text"
          placeholder="Enter Document Title"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.title}
        />
        {formik.touched.title && formik.errors.title ? (
          <Form.Text className="text-danger">{formik.errors.title}</Form.Text>
        ) : null}
      </Form.Group>
      <Card>
        <div className="m-4">          
          <Button variant="primary" type="submit" disabled={isLoading}>
            {isLoading && <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />}
            {isLoading ? 'Chargement...' : 'Enregistrer'}
          </Button>
        </div>
        <Editor
          editorState={editorState}
          onEditorStateChange={setEditorState}
          wrapperClassName="m-4"
          editorClassName="ml-4 mb-4"
          toolbar={{
            options: EDITOR_OPTIONS,
          }}
        />
      </Card>
    </form>
  );
};

export default NewDocument;
