'use client'

import React, { ChangeEvent, FormEvent, useState } from 'react'

import { FormState, ProjectInterface, SessionInterface } from '@/common.types'
import Image from 'next/image'
import FormField from './FormField'

type Props = {
  type: string
  session: SessionInterface
  project?: ProjectInterface
}

const ProjectForm = ({ type, session, project }: Props) => {
  const form = { image: '', title: '' }

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault()
  }

  const handleChangeImage = (e: ChangeEvent) => {}

  const handleStateChange = (fieldName: string, value: string) => {}

  return (
    <form onSubmit={handleFormSubmit} className='flexStart form'>
      <div className='flexStart form_image-container'>
        <label htmlFor='poster' className='flexCenter form_image-label'>
          {!form.image && 'Choose a poster for your project'}
        </label>
        <input
          id='image'
          type='file'
          accept='image/*'
          required={type === 'create' ? true : false}
          className='form_image-input'
          onChange={(e) => handleChangeImage(e)}
        />
        {form.image && (
          <Image
            src={form?.image}
            className='sm:p-10 object-contain z-20'
            alt='image'
            fill
          />
        )}
      </div>

      <FormField
        title='Title'
        state={form.title}
        placeholder='Flexibble'
        setState={(value) => handleStateChange('title', value)}
      />
    </form>
  )
}

export default ProjectForm
