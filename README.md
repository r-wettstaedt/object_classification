# Object classification

This project classifies objects in a set of images using a feature detector and descriptor. All images are compared and images with similar regions are identified and grouped. The whole process is implemented and calculated in the browser using only JavaScript and the HTML5 canvas API.

## Approach

In order to compare similar regions of images, first, points of interests in the images have to be determined. The [Harris Corner Detector](https://en.wikipedia.org/wiki/Corner_detection#The_Harris_.26_Stephens_.2F_Plessey_.2F_Shi.E2.80.93Tomasi_corner_detection_algorithms) is implemented. It extracts corner points of objects in images by finding a variation of the image's gradients. Following is the processing of the POI using a [SIFT descriptor](https://en.wikipedia.org/wiki/Scale-invariant_feature_transform), which creates a histogram of the 8x8 region around each POI. The histogram is fed with the angles of the gradients in the region. By [binning](https://en.wikipedia.org/wiki/Data_binning) these angles to a histogram with the width of 18, each POI is described with a 18-dimensional feature vector. With the help of [k-means++](https://en.wikipedia.org/wiki/K-means%2B%2B), the feature vectors are clustered so that similar POI can be identified. Finally, the classification is performed by the probabilistic classifier [Naive Bayes](https://en.wikipedia.org/wiki/Naive_Bayes_classifier).


## Result

The object classifier calculates and displays a [confusion matrix](https://en.wikipedia.org/wiki/Confusion_matrix), indicating the correctness of the approach. Using quite a simple image set an overall correct rate of 159 and an error rate of 91 is achieved.

![confusion matrix](http://cv.r-wettstaedt.com/images/50Objects.png "confusion matrix")
