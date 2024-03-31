import React from 'react'
import { Create, SimpleForm, TextInput, required } from 'react-admin'

function CourseCreate() {
  return (
    <Create>
      <SimpleForm>
        <TextInput source='title' validate={[required()]} label='Title' />
        <TextInput source='imageSrc' validate={[required()]} label='Image' />
      </SimpleForm>
    </Create>
  )
}

export default CourseCreate
