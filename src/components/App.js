import { useEffect, useState } from 'react';
import { animateScroll } from 'react-scroll';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import toast, { Toaster } from 'react-hot-toast';
import getImages from 'services/image-service';
import Searchbar from './Searchbar/Searchbar';
import Button from './Button/Button';
import ImageGallery from './ImageGallery/ImageGallery';
import Loader from './Loader/Loader';
import { Container } from './styles.styled';
import Modal from './Modal/Modal';

export const App = () => {
  const [largeImageUrl, setLargeImageUrl] = useState('');
  const [alt, setAlt] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);
  const [showLoadMoreBtn, setShowLoadMoreBtn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!query) return;
    setIsLoading(true);
    getImages(query, page)
      .then(({ hits, totalHits }) => {
        if (!hits.length) {
          toast.error('Sorry. There are no images ... 😭');
          return;
        }
        setImages(image => [...image, ...filterSetImages(hits)]);
        setShowLoadMoreBtn(page < Math.ceil(totalHits / 12));
        if (page >= Math.ceil(totalHits / 12))
          toast.error(
            `We're sorry, but you've reached the end of search results.`
          );
      })
      .catch(err => {
        toast.error(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [query, page]);

  const onSubmit = query => {
    setQuery(query);
    setPage(1);
    setImages([]);
    setShowLoadMoreBtn(false);
    setIsLoading(false);
  };

  const filterSetImages = images => {
    const array = images.map(({ id, webformatURL, tags, largeImageURL }) => {
      return { id, webformatURL, tags, largeImageURL };
    });
    return array;
  };

  const scrollOnMoreButton = () => {
    animateScroll.scrollToBottom({
      duration: 1000,
      delay: 10,
      smooth: 'linear',
    });
  };

  const onLoadMore = () => {
    setPage(obj => obj + 1);
    scrollOnMoreButton();
  };

  const toggleModal = (largeImageUrl = '', alt = '') => {
    setLargeImageUrl(largeImageUrl);
    setAlt(alt);
    if (largeImageUrl) disableBodyScroll(document.body);
    else enableBodyScroll(document.body);
  };

  return (
    <Container>
      <Searchbar onSubmit={onSubmit} />
      <ImageGallery onCardClick={toggleModal} images={images} />
      {showLoadMoreBtn && <Button onLoadMore={onLoadMore} />}
      {isLoading && <Loader />}
      {largeImageUrl && (
        <Modal largeImageUrl={largeImageUrl} alt={alt} onClose={toggleModal} />
      )}
      <Toaster />
    </Container>
  );
};
