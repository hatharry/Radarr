import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { icons, kinds, sizes } from 'Helpers/Props';
import HeartRating from 'Components/HeartRating';
import Icon from 'Components/Icon';
import Label from 'Components/Label';
import Link from 'Components/Link/Link';
import MoviePoster from 'Movie/MoviePoster';
import AddNewMovieModal from './AddNewMovieModal';
import styles from './AddNewMovieSearchResult.css';

class AddNewMovieSearchResult extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this.state = {
      isNewAddSeriesModalOpen: false
    };
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isExistingSeries && this.props.isExistingSeries) {
      this.onAddSerisModalClose();
    }
  }

  //
  // Listeners

  onPress = () => {
    this.setState({ isNewAddSeriesModalOpen: true });
  }

  onAddSerisModalClose = () => {
    this.setState({ isNewAddSeriesModalOpen: false });
  }

  //
  // Render

  render() {
    const {
      tmdbId,
      title,
      titleSlug,
      year,
      studio,
      status,
      overview,
      ratings,
      images,
      isExistingSeries,
      isSmallScreen
    } = this.props;
    const {
      isNewAddSeriesModalOpen
    } = this.state;

    const linkProps = isExistingSeries ? { to: `/movie/${titleSlug}` } : { onPress: this.onPress };

    return (
      <div>
        <Link
          className={styles.searchResult}
          {...linkProps}
        >
          {
            !isSmallScreen &&
            <MoviePoster
              className={styles.poster}
              images={images}
              size={250}
            />
          }

          <div>
            <div className={styles.title}>
              {title}

              {
                !title.contains(year) && !!year &&
                <span className={styles.year}>({year})</span>
              }

              {
                isExistingSeries &&
                <Icon
                  className={styles.alreadyExistsIcon}
                  name={icons.CHECK_CIRCLE}
                  size={36}
                  title="Already in your library"
                />
              }
            </div>

            <div>
              <Label size={sizes.LARGE}>
                <HeartRating
                  rating={ratings.value}
                  iconSize={13}
                />
              </Label>

              {
                !!studio &&
                <Label size={sizes.LARGE}>
                  {studio}
                </Label>
              }

              {
                status === 'ended' &&
                <Label
                  kind={kinds.DANGER}
                  size={sizes.LARGE}
                >
                  Ended
                </Label>
              }
            </div>

            <div className={styles.overview}>
              {overview}
            </div>
          </div>
        </Link>

        <AddNewMovieModal
          isOpen={isNewAddSeriesModalOpen && !isExistingSeries}
          tmdbId={tmdbId}
          title={title}
          year={year}
          overview={overview}
          images={images}
          onModalClose={this.onAddSerisModalClose}
        />
      </div>
    );
  }
}

AddNewMovieSearchResult.propTypes = {
  tmdbId: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  titleSlug: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
  studio: PropTypes.string,
  status: PropTypes.string.isRequired,
  overview: PropTypes.string,
  statistics: PropTypes.object.isRequired,
  ratings: PropTypes.object.isRequired,
  images: PropTypes.arrayOf(PropTypes.object).isRequired,
  isExistingSeries: PropTypes.bool.isRequired,
  isSmallScreen: PropTypes.bool.isRequired
};

export default AddNewMovieSearchResult;