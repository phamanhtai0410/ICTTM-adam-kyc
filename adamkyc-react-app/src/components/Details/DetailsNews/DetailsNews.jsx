import './DetailsNews.style.scss'
import { useEffect, useState } from 'react';

export function DetailsNews ({ serverData }) {
  const [relatedNews, setRelatedNews] = useState([]);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);
  const [loadMoreVisible, setLoadMoreVisible] = useState(true);

  useEffect(() => {
    fetch(`https://powerful-hound-loving.ngrok-free.app/api/1/related-news/${serverData[0].id}?offset=${offset}&limit=${limit}`, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
      .then(response => response.json())
      .then(serverData => {
        if (serverData.data.length === 0) {
          setLoadMoreVisible(false);
        }
        setRelatedNews(prevNews => [...prevNews, ...serverData.data]);
      })
      .catch(error => console.log(error));
  }, [serverData, offset, limit]);

  const handleLoadMoreClick = () => {
    setOffset(offset + limit);
  };

  return (
    <div className='person-details__media person-details__factsheet'>
        <div className='person-details__factsheet-column'>
            <div className='person-details__media-column__1'><p className='person-details__media-column__subtext'>Title</p></div>
            <div className='person-details__media-column__2'><p className='person-details__media-column__subtext'>Site</p></div>
            <div className='person-details__media-column__3'><p className='person-details__media-column__subtext'>Language</p></div>
        </div>
        {relatedNews.length === 0 ? (
          <div className='person-details__factsheet-column'>
            <p>No related news found.</p>
          </div>
        ) : (
          <>
            {relatedNews.map(news => (
              <div key={news.id} className='person-details__factsheet-column'>
                <div className='person-details__media-column__1 person-details__relationship-column__1'><a href={news.url} target="_blank" rel="noopener noreferrer">{news.title}</a></div>
                <div className='person-details__media-column__2'><p className='person-details__media-column__subtext' >{news.site}</p></div>
                <div className='person-details__media-column__3'><p className='person-details__media-column__subtext' >{news.language}</p></div>
              </div>
            ))}
            {loadMoreVisible && (
              <div className='person-details__factsheet-column'>
                <button onClick={handleLoadMoreClick} class='load-more-button'>Load More</button>
              </div>
            )}
          </>
        )}
    </div>
  )
}