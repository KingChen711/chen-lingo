import React from 'react'
import { Datagrid, List, NumberField, ReferenceArrayField, ReferenceField, TextField } from 'react-admin'

function LessonList() {
  return (
    <List>
      <Datagrid rowClick='edit'>
        <TextField source='id' />
        <TextField source='title' />
        <ReferenceField source='unitId' reference='units' />
        <NumberField source='order' />
        <ReferenceArrayField source='lessonId' reference='challenges' />
      </Datagrid>
    </List>
  )
}

export default LessonList
