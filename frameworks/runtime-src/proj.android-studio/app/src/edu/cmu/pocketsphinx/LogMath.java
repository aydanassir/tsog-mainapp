/* ----------------------------------------------------------------------------
 * This file was automatically generated by SWIG (http://www.swig.org).
 * Version 3.0.7
 *
 * Do not make changes to this file unless you know what you are doing--modify
 * the SWIG interface file instead.
 * ----------------------------------------------------------------------------- */

package edu.cmu.pocketsphinx;

public class LogMath {
  private transient long swigCPtr;
  protected transient boolean swigCMemOwn;

  protected LogMath(long cPtr, boolean cMemoryOwn) {
    swigCMemOwn = cMemoryOwn;
    swigCPtr = cPtr;
  }

  protected static long getCPtr(LogMath obj) {
    return (obj == null) ? 0 : obj.swigCPtr;
  }

  protected void finalize() {
    delete();
  }

  public synchronized void delete() {
    if (swigCPtr != 0) {
      if (swigCMemOwn) {
        swigCMemOwn = false;
        SphinxBaseJNI.delete_LogMath(swigCPtr);
      }
      swigCPtr = 0;
    }
  }

  public LogMath() {
    this(SphinxBaseJNI.new_LogMath__SWIG_0(), true);
  }

  public LogMath(SWIGTYPE_p_logmath_t ptr) {
    this(SphinxBaseJNI.new_LogMath__SWIG_1(SWIGTYPE_p_logmath_t.getCPtr(ptr)), true);
  }

}
