/* ----------------------------------------------------------------------------
 * This file was automatically generated by SWIG (http://www.swig.org).
 * Version 3.0.7
 *
 * Do not make changes to this file unless you know what you are doing--modify
 * the SWIG interface file instead.
 * ----------------------------------------------------------------------------- */

package edu.cmu.pocketsphinx;

public class NBestIterator implements java.util.Iterator<NBest> {

  private long swigCPtr;
  protected boolean swigCMemOwn;

  public NBestIterator(long cPtr, boolean cMemoryOwn) {
    swigCMemOwn = cMemoryOwn;
    swigCPtr = cPtr;
  }

  public static long getCPtr(NBestIterator obj) {
    return (obj == null) ? 0 : obj.swigCPtr;
  }

  @Override
  public void remove() {
    throw new UnsupportedOperationException();
  }

  protected void finalize() {
    delete();
  }

  public synchronized void delete() {
    if (swigCPtr != 0) {
      if (swigCMemOwn) {
        swigCMemOwn = false;
        PocketSphinxJNI.delete_NBestIterator(swigCPtr);
      }
      swigCPtr = 0;
    }
  }

  public void setPtr(SWIGTYPE_p_ps_nbest_t value) {
    PocketSphinxJNI.NBestIterator_ptr_set(swigCPtr, this, SWIGTYPE_p_ps_nbest_t.getCPtr(value));
  }

  public SWIGTYPE_p_ps_nbest_t getPtr() {
    long cPtr = PocketSphinxJNI.NBestIterator_ptr_get(swigCPtr, this);
    return (cPtr == 0) ? null : new SWIGTYPE_p_ps_nbest_t(cPtr, false);
  }

  public NBestIterator(SWIGTYPE_p_ps_nbest_t ptr) {
    this(PocketSphinxJNI.new_NBestIterator(SWIGTYPE_p_ps_nbest_t.getCPtr(ptr)), true);
  }

  public NBest next() {
    long cPtr = PocketSphinxJNI.NBestIterator_next(swigCPtr, this);
    return (cPtr == 0) ? null : new NBest(cPtr, true);
  }

  public boolean hasNext() {
    return PocketSphinxJNI.NBestIterator_hasNext(swigCPtr, this);
  }

}
