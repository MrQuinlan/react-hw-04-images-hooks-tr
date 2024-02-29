import './App.css';
import { useState, useEffect } from 'react';
import API from '../services/API';
import Searchbar from './Searchbar';
import { FaSearch } from 'react-icons/fa';
import ImageGallery from './ImageGallery';
import ImageGalleryItem from './ImageGalleryItem';
import Button from './Button';
import Error from './Error';
import Loader from './Loader';
import { createPortal } from 'react-dom';
import Modal from './Modal';

const App = () => {
  const [gallery, setGallery] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalHits, setTotalHits] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [currentPicture, setCurrentPicture] = useState({});
  const [error, setError] = useState('No images');
  const [status, setStatus] = useState('idle');

  const modalPortalRef = document.querySelector('#modal-root');

  useEffect(() => {
    if (searchQuery === '') {
      return;
    }

    const gallery = API(searchQuery, page);

    gallery
      .then(res => {
        if (res.totalHits === 0) {
          return;
        }
        setStatus('pending');
        return res;
      })
      .then(({ hits, totalHits }) => {
        setTotalHits(totalHits);

        setGallery(state => [
          ...state,
          ...hits.map(({ tags, largeImageURL, webformatURL, id }) => ({
            tags,
            largeImageURL,
            webformatURL,
            id,
          })),
        ]);
        setStatus('resolved');
      })
      .catch(() => setError('error'));
  }, [page, searchQuery]);

  const onSubmit = query => {
    if (!query) {
      return;
    }
    setGallery([]);
    setSearchQuery(query);
    setPage(1);
  };

  const onLoadMore = () => {
    setPage(page + 1);
  };

  const toggleModal = () => {
    if (showModal) {
      setCurrentPicture({});
    }

    setShowModal(!showModal);
  };

  const onOpenModal = picture => {
    setCurrentPicture(picture);
    toggleModal();
  };

  return (
    <div className="App">
      <Searchbar onSubmit={onSubmit}>
        <FaSearch size="32" />
      </Searchbar>

      {status === 'resolved' && (
        <ImageGallery>
          <ImageGalleryItem
            gallery={gallery}
            onOpenModal={onOpenModal}
          ></ImageGalleryItem>
        </ImageGallery>
      )}

      {status === 'resolved' &&
        totalHits > gallery.length &&
        gallery.length >= 12 && (
          <Button loadMore="Load more" onLoadMore={onLoadMore} />
        )}

      {status === 'error' && <Error message={error} />}

      {status === 'pending' && <Loader />}

      {showModal &&
        createPortal(
          <Modal toggleModal={toggleModal} {...currentPicture} />,
          modalPortalRef
        )}
    </div>
  );
};

export default App;
