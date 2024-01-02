import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Title } from 'components'
import { buildUrl } from 'helpers'
import { useStore } from 'providers'
import assets from '../../../../assets/index'
import './AdminEditProfileTopics.style.scss'

export function AdminEditProfileTopics ({ onRecord }) {
  const { topics } = useStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTopics, setSelectedTopics] = useState([])
  const [selectedTopicsKeys, setSelectedTopicsKeys] = useState([])
  const inputRef = useRef()

  function filterTopics () {
    const query = searchQuery.toLowerCase()
    return query.trim() === ''
      ? []
      : Object.values(topics.data).filter(key => key.toLowerCase().includes(query) && !selectedTopics.includes(key))
  }

  function handleDivClick () {
    inputRef.current.focus()
  };

  function handleSelectTopic (topic) {
    if (!selectedTopics.includes(topic)) {
      setSelectedTopics([...selectedTopics, topic])
      setSelectedTopicsKeys((prevKeys) => [...prevKeys, Object.entries(topics.data).find(([key, value]) => value === topic)?.[0]])
    }
    setSearchQuery('')
  }

  function handleRemoveTopic (topic) {
    const updatedTopics = selectedTopics.filter((selectedTopic) => selectedTopic !== topic)
    const updatedTopicsKeys = selectedTopicsKeys.filter(
      (selectedTopicKey) => Object.entries(topics.data).find(([key, value]) => key === selectedTopicKey)?.[1] !== topic
    )

    setSelectedTopics(updatedTopics)
    setSelectedTopicsKeys(updatedTopicsKeys)
    onRecord(updatedTopicsKeys)
  }

  useEffect(() => {
    if (selectedTopicsKeys.length !== 0) onRecord(selectedTopicsKeys)
  }, [selectedTopicsKeys])

  return (
    <div className='admin-changelog'>
      <Title text='Topics' textClassname='hero-title__smaller' />
      <div className='admin-edit__label-multiple__container admin-topics--selected' onClick={handleDivClick}>
        {selectedTopics.map((selectedTopic, index) => (
          <li key={selectedTopic} className='recentsearch-list__item' onClick={() => handleSelectTopic(selectedTopic)}>
            <button
              onClick={() => handleRemoveTopic(selectedTopic)} className='admin-edit__label-multiple__container-item__button admin-edit__label-multiple__container-item__button--topics'
            >
              <assets.Close width={16} height={16} />
            </button>
            <Link
              aria-label='link to search tag view'
              to={buildUrl(selectedTopic)}
            >
              <assets.Hash
                width={16}
                height={16}
                className='recentsearch-list__icon search-item__flex-icon'
              />
              <p className='recentsearch-subtitle'>{selectedTopic}</p>
            </Link>
          </li>
        ))}
        <input
          className='admin-edit__label-input'
          ref={inputRef}
          placeholder='Search topics'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className='admin-changelog--element'>
        {searchQuery.trim() !== '' && (
          <ul className='admin-topics__search-container'>
            {filterTopics().map((result, index) => (
              <li key={result} className='recentsearch-list__item' onClick={() => handleSelectTopic(result)}>
                <p className='recentsearch-subtitle'>{result}</p>
              </li>
            ))}
            {filterTopics().length === 0 && searchQuery.trim() !== '' && (
              <div className='no-results'>No search results</div>
            )}
          </ul>
        )}
      </div>
    </div>
  )
}
