export enum CleaningMethod {
  Z_SCORE = "z_score",
  IQR = "iqr",
  ROLLING_Z_SCORE = "rolling_z_score",
  ROLLING_IQR = "rolling_iqr",
  MAD = "mad",
  STL_RESIDUAL = "stl_residual",
  CHANGE_POINT = "change_point",
  ISOLATION_FOREST = "isolation_forest",
  LOCAL_OUTLIER_FACTOR = "local_outlier_factor",
  ONE_CLASS_SVM = "one_class_svm",
}

export function isValidCleaningMethod(method: string): method is CleaningMethod {
  return Object.values(CleaningMethod).includes(method as CleaningMethod);
}
