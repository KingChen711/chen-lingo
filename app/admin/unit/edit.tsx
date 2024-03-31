import React from 'react'
import { Edit, NumberInput, ReferenceInput, SimpleForm, TextInput, required } from 'react-admin'

function UnitEdit() {
  return (
    <Edit>
      <SimpleForm>
        <TextInput source='id' validate={[required()]} label='Id' />
        <TextInput source='title' validate={[required()]} label='Title' />
        <TextInput source='description' validate={[required()]} label='Description' />
        <ReferenceInput source='courseId' reference='courses' />
        <NumberInput source='order' validate={[required()]} label='Order' />
      </SimpleForm>
    </Edit>
  )
}

export default UnitEdit
