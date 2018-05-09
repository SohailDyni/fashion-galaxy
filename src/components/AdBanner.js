import {
	AdMobBanner,
	AdMobInterstitial,
	PublisherBanner,
	AdMobRewarded
} from 'expo';
import React from 'react';
const ADUNITID = `ca-app-pub-6173700008272939/8405079538`;
const BANNER_ID = `ca-app-pub-6173700008272939/8405079538`;
const INTERSTITIAL_ID = `ca-app-pub-1425926517331745/1141181467`;
const REWARDED_ID = `ca-app-pub-1425926517331745/3923257478`;

class AdBanner extends React.Component {

    constructor(props) {
        super(props);
    }
    render() {        
        return (
            <AdMobBanner
                bannerSize="smartBanner"
                adUnitID={BANNER_ID}
                didFailToReceiveAdWithError={this.bannerError}
            />
        );
    }

}

export default AdBanner;
