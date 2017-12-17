import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import cx from 'classnames';

import consts from '../consts';
import ReactHover from './react-hover';

const {
  ACTIONS,
  LANG_BUTTON,
} = consts;

@autobind
@observer
class ActionButton extends Component {
  mark () {
    this.props.mark(this.props.action);
  }

  render () {
    const ICONS = {
      READ: 'ok',
      UNREAD: 'remove',
      SKIP: 'fast-forward',
      UNSKIP: 'play',
    };

    return (
      <a className='action-button' onClick={this.mark}>
        {' '}<span className={`glyphicon glyphicon-${ICONS[this.props.action]}`} aria-hidden='true' alt={LANG_BUTTON[this.props.action]} />
      </a>
    );
  }

  static propTypes = {
    mark: PropTypes.func,
    action: PropTypes.string,
  }
}

@autobind
@observer
class Comic extends Component {
  mark (action) {
    const {
      comic: {
        id,
        series_id,
      },
      store,
    } = this.props;

    store.mark(series_id, id, action);
  }

  @action
  async pull () {
    const {
      comic,
      store,
    } = this.props;

    store.pull(comic.series_id);
  }

  currentState () {
    const {
      comic: {
        read,
        skipped,
      },
      pulled,
    } = this.props;

    if (!pulled) { return 'unpulled'; }
    if (read) { return 'read'; }
    if (skipped) { return 'skipped'; }
    return 'toread';
  }

  render () {
    const {
      comic: {
        title,
        on_sale,
        series_id,
        images,
      },
      store,
    } = this.props
    , label = `${title} - ${on_sale}`
    , currentState = this.currentState()
    , isLoading = store.isLoading.get(`series.${series_id}`)
    , buttons = {
      'unpulled': (
        <span>
          <span className='glyphicon glyphicon-plus' aria-hidden='true' />
          {' '}<a onClick={this.pull}>Pull</a>
        </span>),
      'read': <ActionButton mark={this.mark} action={ACTIONS.UNREAD} />,
      'skipped': <ActionButton mark={this.mark} action={ACTIONS.UNSKIP} />,
      'toread': (
        <span>
          {' '}<ActionButton mark={this.mark} action={ACTIONS.READ} />
          {' '}<ActionButton mark={this.mark} action={ACTIONS.SKIP} />
        </span>
      ),
    }
    , classNames = cx(
      `comic-${currentState}`,
      {
        'loading': isLoading,
      })
    , imageSrc = images[0]
    ;

    return (
      <li className={classNames}>
        <ReactHover options={{
          followCursor: false,
          shiftX: 20,
          shiftY: 0,
        }}>
          <ReactHover.Trigger>
            <a className='action-button' href={imageSrc} target='_blank'>
              <span className='glyphicon glyphicon-picture' aria-hidden='true' />
            </a>
          </ReactHover.Trigger>
          <ReactHover.Hover>
            <img className='cover' src={imageSrc} />
          </ReactHover.Hover>
        </ReactHover>
        {' '}{label}
        {' '}{buttons[currentState]}
      </li>
    );
  }

  static propTypes = {
    comic: PropTypes.object,
    mark: PropTypes.func,
    pulled: PropTypes.bool,
    store: PropTypes.object,
  }
}

export default Comic;
