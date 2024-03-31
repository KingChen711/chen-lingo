import React from 'react'
import { Edit, SimpleForm, TextInput, required } from 'react-admin'

function CourseEdit() {
  return (
    <Edit>
      <SimpleForm>
        <TextInput source='id' validate={[required()]} label='Id' />
        <TextInput source='title' validate={[required()]} label='Title' />
        <TextInput source='imageSrc' validate={[required()]} label='Image' />
      </SimpleForm>
    </Edit>
  )
}

export default CourseEdit
