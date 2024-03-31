import React from 'react'
import { Create, NumberInput, ReferenceInput, SimpleForm, TextInput, required } from 'react-admin'

function LessonCreate() {
  return (
    <Create>
      <SimpleForm>
        <TextInput source='title' validate={[required()]} label='Title' />
        <ReferenceInput source='unitId' reference='units' />
        <NumberInput source='order' validate={[required()]} label='Order' />
        {/* <ReferenceArrayInput source='lessonId' reference='challenges' /> */}
      </SimpleForm>
    </Create>
  )
}

export default LessonCreate
