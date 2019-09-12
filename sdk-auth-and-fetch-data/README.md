<p align="right">
  <a href="https://youtu.be/29Cuv6OhBmA">
    Youtube version<br />
    <img src="https://img.youtube.com/vi/29Cuv6OhBmA/3.jpg" alt="Cognite JS SDK video guide" title="Watch our video guide" align="right" />
  </a>
</p>

## Introduction to Cognite Javascript SDK

This guide will show you how to create a simple app using [Cognite JavaScript SDK](https://github.com/cognitedata/cognitesdk-js).
The app will be able to authenticate with [Cognite Data Fusion (CDF)](https://cognite.com/products/cognite-data-fusion/) and to fetch some data from it.
To use an SDK is the simplest way to retrieve data from CDF.
We will use data from the [Open Industrial Data project](https://www.youtube.com/watch?v=_Gvu5kN73JA).

To be able to proceed with this guide you need to have an [npm](https://youtu.be/jHDhaSSKmB0) installed on your machine.  
In this guide we will use [create-react-app](https://facebook.github.io/create-react-app/docs/getting-started).

```
npx create-react-app hello-world
cd hello-world
```

The next step is to install the Cognite Javascript SDK.

```
npm install @cognite/sdk --save
```

Now that everything is ready, we can proceed with coding.

First we need to authenticate the SDK to gain access to the data.
You can do this either by using the OAuth login flow or you can use API keys.
In this example, we will use the OAuth login flow to avoid storing sensitive API keys in our source code. You can find a comprehensive guide to Cognite JS SDK authentication [here](https://github.com/cognitedata/cognitesdk-js/blob/v1/guides/authentication.md).  

There are two ways to log in the user:
 - redirect to the login page
 - login popup window

Here we will show you how to do both. Let's start with using login with redirect.
### Authentication with redirect
You can just replace the code in <code>./src/App.js:</code>  
```
import React, { Component } from 'react';
import { CogniteClient } from '@cognite/sdk';

const project = 'publicdata';

class App extends Component {

  async componentDidMount() {
    const client = new CogniteClient({ appId: 'Cognite SDK tutorial' });
    client.loginWithOAuth({ project });
    client.authenticate();
  }

  render() {
    return <div className="App"></div>
  }
}

export default App;
```

Now that we have implemented the authentication part, it is time to test it out. 
It is important that we enable SSL or HTTPS since Cognite only allows trusted web-pages to authenticate.

Go to the terminal, run:
```
HTTPS=true npm run start
```
and check the result in a browser.
You should now be able to login to the project `publicdata`.

When we have authenticated the SDK we are ready to fetch data with it. In this guide, we will fetch 10 assets. Worth to mention that usage of `client.authenticate()` is reduntant here, as the SDK will call it automatically on API request. That's why we removed it from the code below.   
<code>./src/App.js:</code>  
```
import React, { Component } from 'react';
import { CogniteClient } from '@cognite/sdk';

const project = 'publicdata';

class App extends Component {
  state = {
    assets: null
  }

  async componentDidMount() {
    const client = new CogniteClient({ appId: 'Cognite SDK tutorial' });
    client.loginWithOAuth({ project });
    const assets = await client.assets.list().autoPagingToArray({ limit: 10 });
    this.setState({ assets });
  }

  render() {
    return (<div className="App"></div>)
  }
}

export default App;
```

Let us move on to visualize the assets we just fetched. 
We will do it very basic this time, and only print out the asset names.  
<code>./src/App.js:</code>  
```
import React, { Component } from 'react';
import { CogniteClient } from '@cognite/sdk';

const project = 'publicdata';

class App extends Component {
  state = { assets: null }

  async componentDidMount() {
    const client = new CogniteClient({ appId: 'Cognite SDK tutorial' });
    client.loginWithOAuth({ project });
    const assets = await client.assets.list().autoPagingToArray({ limit: 10 });
    this.setState({ assets });
  }

  render() {
    const { assets } = this.state;
    return (
      <div className="App">  
        {assets && assets.map(asset => (
          <p key={asset.id}>
            {asset.name}
          </p>
        ))}
      </div>
    )
  }
}

export default App;
```

There we go! We have now successfully fetched data using the SDK.

### Authentication with popup

As was mentioned above, it is possible to authenticate the SDK without performing a browser redirect but rather provide a popup window.  
The benefit of using this solution is that you don’t lose the state of the application.
Let's change our code to use a popup window. We'll also do some refactoring, so it looks more readable and add a button, so we can call the popup on user interaction to avoid having the popup-window blocked by the browser.  
<code>./src/App.js:</code>  
```
import React, { Component } from 'react';
import { CogniteClient, POPUP, loginPopupHandler, isLoginPopupWindow } from '@cognite/sdk';

const project = 'publicdata';

class App extends Component {
  state = {
    assets: null,
    client: null
  }

  async componentDidMount() {
    if(isLoginPopupWindow()) {
      loginPopupHandler();
      return;
    }

    const client = new CogniteClient({ appId: 'Cognite SDK tutorial' });
    client.loginWithOAuth({
      project,
      onAuthenticate: POPUP
    });
    this.setState({ client });
  }

  fetchAssets = async () => {
    const { client } = this.state;
    const assets = await client.assets.list().autoPagingToArray({ limit: 10 });
    this.setState({ assets });
  }

  renderAssets = () => {
    return (
      <>
        {this.state.assets.map(asset => (
          <p key={asset.id}>
            {asset.name}
          </p>
        ))}
      </>
    )
  }

  render() {
    const { assets } = this.state;
    return (
      <div className="App">  
        {assets ? this.renderAssets() : <button onClick={this.fetchAssets}><h1>Click here to fetch assets from Cognite</h1></button>}
      </div>
    )
  }
}

export default App;
```

So that is how you authenticate and fetch data using the Cognite Javascript SDK.

Here you can find some [more documentation about CDF](https://doc.cognitedata.com/)
