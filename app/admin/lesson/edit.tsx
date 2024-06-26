import React from 'react'
import { Edit, NumberInput, ReferenceInput, SimpleForm, TextInput, required } from 'react-admin'

function LessonEdit() {
  return (
    <Edit>
      <SimpleForm>
        <TextInput source='id' validate={[required()]} label='Id' />
        <TextInput source='title' validate={[required()]} label='Title' />
        <ReferenceInput source='unitId' reference='units' />
        <NumberInput source='order' validate={[required()]} label='Order' />
      </SimpleForm>
    </Edit>
  )
}

export default LessonEdit
