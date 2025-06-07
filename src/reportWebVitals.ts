/**
 * @file src/reportWebVitals.ts
 * @description Web Vitals monitoring and reporting for performance metrics
 * 
 * This module provides functionality to measure and report Core Web Vitals and other
 * performance metrics. It's part of Google's Web Vitals initiative to standardize
 * the measurement of user experience on the web.
 * 
 * The following metrics are tracked:
 * - CLS (Cumulative Layout Shift): Measures visual stability
 * - FID (First Input Delay): Measures interactivity
 * - FCP (First Contentful Paint): Measures loading performance
 * - LCP (Largest Contentful Paint): Measures loading performance
 * - TTFB (Time to First Byte): Measures server response time
 * 
 * @see https://web.dev/vitals/
 * @see https://github.com/GoogleChrome/web-vitals
 * 
 * @module reportWebVitals
 */

// Import the web-vitals module with a different import style
import * as webVitals from 'web-vitals';

type ReportHandler = (metric: webVitals.Metric) => void;

/**
 * Reports web vitals metrics using the provided handler function
 * @param {ReportHandler} onPerfEntry - Optional callback function to handle the metrics
 */
const reportWebVitals = (onPerfEntry?: ReportHandler): void => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    try {
      // Cumulative Layout Shift (CLS)
      webVitals.onCLS(onPerfEntry);
      // First Input Delay (FID)
      webVitals.onFID(onPerfEntry);
      // First Contentful Paint (FCP)
      webVitals.onFCP(onPerfEntry);
      // Largest Contentful Paint (LCP)
      webVitals.onLCP(onPerfEntry);
      // Time to First Byte (TTFB)
      webVitals.onTTFB(onPerfEntry);
    } catch (error) {
      console.error('Error in web-vitals:', error);
    }
  }
};

export default reportWebVitals;
