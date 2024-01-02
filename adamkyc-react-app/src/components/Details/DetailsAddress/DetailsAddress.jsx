export function DetailsAddress () {
  return (
    <div className=''>
      <iframe
        className='person-details__iframe'
        src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d112696.93178856072!2d-81.99233473076181!3d28.03122612245158!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88dd38b2df0f0007%3A0x29d1320fb8a2d508!2z0JvQtdC50LrQu9C10L3QtCwg0KTQu9C-0YDQuNC00LAsINCh0KjQkA!5e0!3m2!1sru!2sua!4v1698158663946!5m2!1sru!2sua&iwloc=near&output=embed&disableDefaultUI&output=embed'
        width='600'
        height='450'
        aria-label='Google Map iframe'
        title='Cool place in my city'
        allowFullScreen=''
        loading='lazy'
        referrerPolicy='no-referrer-when-downgrade'
      />
    </div>
  )
}
