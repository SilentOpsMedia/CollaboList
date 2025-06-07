/**
 * Web Vitals Reporting
 * 
 * This module provides functions to measure and report web vitals metrics.
 * Web Vitals is an initiative by Google to provide unified guidance for quality signals
 * that are essential to delivering a great user experience on the web.
 */

import { ReportHandler } from 'web-vitals';

/**
 * Reports web vitals metrics using the provided handler function
 * @param {ReportHandler} onPerfEntry - Optional callback function to handle the metrics
 */
const reportWebVitals = (onPerfEntry?: ReportHandler): void => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      // Cumulative Layout Shift (CLS)
      getCLS(onPerfEntry);
      // First Input Delay (FID)
      getFID(onPerfEntry);
      // First Contentful Paint (FCP)
      getFCP(onPerfEntry);
      // Largest Contentful Paint (LCP)
      getLCP(onPerfEntry);
      // Time to First Byte (TTFB)
      getTTFB(onPerfEntry);
    }).catch(error => {
      console.error('Error loading web-vitals:', error);
    });
  }
};

export default reportWebVitals;
