# AmazonNav

A work in progress solution to enable navigating Amazon Instant Video using a
keyboard, or more specifically a MCE Remote.  The solution runs as a
[Chrome extension](https://developer.chrome.com/extensions) that injects
keyboard handling into the content page from Amazon.  

**Note: this project is still under construction**

## Getting Started

This project is not yet available from the [Chrome web store](https://chrome.google.com/webstore/category/extensions) and will need to
be manually installed following the instructions below.  

This only works with Amazon UK site at present, and has limited functionality
and testing.

### Prerequisites

This software runs as a Chrome extension and has been developed on chrome
version 63.0.3239.84, Chrome must be installed on a Computer to run this extension.

see [Download and install Chrome Desktop](https://www.google.com/chrome/browser/desktop/index.html)

### Installing

1. download the repository to your local machine `git clone  https://github.com/darren-gibson/AmazonNav.git`
2. Open Google Chrome and navigate to [chrome://extensions/](chrome://extensions/), check the box for Developer mode in the top right.
3. click the Load unpacked extension button and select the folder that the AmazonNav.git repository was cloned to in step (1).

To test, navigate to the [UK Amazon Video Page](https://www.amazon.co.uk/Amazon-Video/b/ref=sv_uk_8?ie=UTF8&node=3010085031).

## Running the tests

No unit tests have been created for this project.

## Built With

* [jQuery](https://jquery.com/) - a fast, small, and feature-rich JavaScript library
* [jQuery.scrollTo](https://github.com/flesler/jquery.scrollTo) - Lightweight, cross-browser and highly customizable animated scrolling with jQuery


## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags).

## Authors

* **Darren Gibson** - *Initial work* - [Darren Gibson](https://github.com/darren-gibson)

See also the list of [contributors](https://github.com/darren-gibson/AmazonNav/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
