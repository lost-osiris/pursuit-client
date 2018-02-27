/* global window */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import mixpanel from 'mixpanel-browser';

import { MP_HOME_PAGE_LOAD } from 'actions/mixpanelTypes';
import ManualCaptureUploadToggle from 'components/ManualCaptureUploadToggle/ManualCaptureUploadToggle';
import DefaultButton from 'components/DefaultButton/DefaultButton';
import UploadButton from 'components/UploadButton/UploadButton';
import CapturePreview from 'components/CapturePreview/CapturePreview';
import tracking from 'images/captureStatusIcons/tracking.png';
import notTracking from 'images/captureStatusIcons/notTracking.png';
import upToDate from 'images/captureStatusIcons/upToDate.png';
import uploading from 'images/captureStatusIcons/uploading.png';
import error from 'images/captureStatusIcons/error.png';
import collapse from 'images/genericIcons/upArrow.svg';
import open from 'images/genericIcons/downArrow.svg';
import './HomePage.m.css';

const electron = window.require('electron');

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = { showPreview: false };
  }

  componentDidMount() {
    mixpanel.track(MP_HOME_PAGE_LOAD, {
      username: this.props.user.username,
      user_id: this.props.user.id,
    });
  }

  render() {
    return (
      <div styleName="wrapper">
        <DefaultButton
          text="Open Match History"
          onClick={(e) => {
            e.preventDefault();
            electron.shell.openExternal(`${process.env.REACT_APP_TAVERN_ROOT_URL}/profile`);
          }}
          slim
          color="Aqua"
        />
        <h1 styleName="title"> STATUS </h1>
        {this.props.captureStatus.capturing ?
          <div styleName="statusWrapper">
            <img src={tracking} alt="tracking" styleName="statusIcon" />
            <h2 styleName="statusText">
              Tracking
              <p className="italic"> Keep this running while you play Overwatch </p>
            </h2>
          </div>
          :
          <div styleName="statusWrapper">
            <img src={notTracking} alt="not tracking" styleName="statusIcon" />
            <h2 styleName="statusText">
              Not Tracking
              <p className="italic"> Launch Overwatch and we&apos;ll automatically start tracking </p>
            </h2>
          </div>
        }
        <div styleName="capturePreviewWrapper">
          <h5 className="center italic">
            <a
              styleName="showPreview"
              className="inlineBlock"
              onClick={() => this.setState({ showPreview: !this.state.showPreview })}
            >
              {this.state.showPreview ? 'Hide Capture Preview' : 'Show Capture Preview'}
            </a>
          </h5>
          {this.state.showPreview && <CapturePreview />}
        </div>
        {!this.props.manualCaptureUpload && this.props.captureStatus.currentUpload === null &&
          <div styleName="statusWrapper">
            <img src={upToDate} alt="up to date" styleName="statusIcon" />
            <h2 styleName="statusText"> Up To Date </h2>
            <div styleName="toggleWrapper">
              <ManualCaptureUploadToggle />
            </div>
          </div>
        }
        {!this.props.manualCaptureUpload && this.props.captureStatus.currentUpload !== null &&
          this.props.captureStatus.currentUpload.error === null &&
          <div styleName="statusWrapper">
            <img src={uploading} alt="uploading" styleName="statusIcon" />
            <h2 styleName="statusText"> Uploading </h2>
            <div styleName="toggleWrapper">
              <ManualCaptureUploadToggle />
            </div>
          </div>
        }
        {!this.props.manualCaptureUpload && this.props.captureStatus.currentUpload !== null &&
          this.props.captureStatus.currentUpload.error !== null &&
          <div styleName="statusWrapper">
            <img src={error} alt="error" styleName="statusIcon" />
            <h2 styleName="statusText">
              Upload Error
              <p className="italic"> We&apos;ll keep trying to upload </p>
            </h2>
            <div styleName="toggleWrapper">
              <ManualCaptureUploadToggle />
            </div>
          </div>
        }
        {this.props.manualCaptureUpload &&
          <div styleName="statusWrapper">
            <UploadButton />
            <div styleName="toggleWrapper">
              <ManualCaptureUploadToggle />
            </div>
          </div>
        }
        <div styleName="tipWrapper">
          <p> Once you finish a match, it should appear in <br />your match history within 10 minutes. </p>
        </div>
        <div styleName="troubleshootWrapper">
          <h3 styleName="troubleshootTitle" className="uppercase"> Ping Issues? </h3>
          <h5 styleName="troubleshoot">
            Try turning auto upload off and manually upload your matches at the end of your session.
          </h5>
          <h5 styleName="troubleshoot"> If you are seeing inaccurate matches, see our <a
            styleName="troubleshootLink"
            className="underline inlineBlock"
            onClick={(e) => {
              e.preventDefault();
              electron.shell.openExternal(`${process.env.REACT_APP_TAVERN_ROOT_URL}/troubleshoot`);
            }}
          >troubleshooting</a>.</h5>
          <div styleName="troubleshootButton">
            <DefaultButton
              text="Contact Us"
              color="Aqua"
              onClick={(e) => {
                e.preventDefault();
                electron.shell.openExternal('mailto:support@pursuit.gg');
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

HomePage.propTypes = {
  user: PropTypes.object.isRequired,
  manualCaptureUpload: PropTypes.bool.isRequired,
  captureStatus: PropTypes.object.isRequired,
};

const mapStateToProps = ({ user, settings, captureStatus }) => ({
  user,
  manualCaptureUpload: settings.manualCaptureUpload,
  captureStatus,
});

export default connect(mapStateToProps, {})(HomePage);
