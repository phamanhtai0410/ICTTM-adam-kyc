import { Title } from 'components'
import './DetailCreateReview.style.scss'

export function DetailCreateReview ({ data, onChange, onSave }) {
  function handleSubmit (e) {
    e.preventDefault()
    onSave(e)
  }

  return (
    <div className='admin-review'>
      <Title text='Create your note' textClassname='hero-title__smaller' />
      <form className='admin-review--form' onSubmit={handleSubmit}>
        <label className='admin-review--label'>
          <p className='report-form__subtext'>Title <span className='report-form__subtext--star'>*</span></p>
          <input
            name='subject'
            placeholder='What is the subject of this note?'
            className='admin-review--input admin-review--text'
            value={data.subject}
            onChange={(e) => onChange(e, data.id)}
            required
          />
        </label>
        <label className='admin-review--label'>
          <p className='report-form__subtext'>Note <span className='report-form__subtext--star'>*</span></p>
          <textarea
            className='admin-review--textarea admin-review--text'
            value={data.note}
            onChange={(e) => onChange(e, data.id)}
            name='note'
            placeholder='Please describe your note'
            required
          >
            Qqqqq
          </textarea>
        </label>
        <button
          type='submit'
          aria-label='button for creating review'
          className='admin-review--button admin-review--text'
        >
          Create
        </button>
      </form>
    </div>
  )
}
