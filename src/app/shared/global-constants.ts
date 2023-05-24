export class GlobalConstants {
  public static genericError: string =
    'Something Went Wrong! Please Try Again!!';

  public static nameRegex: string = '[A-Za-z0-9 ]*';

  public static emailRegex: string =
    '[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}';

  public static contactRegex: string = '^[e0-9]{10,10}$';

  public static error: string = 'error';

  public static unauthorized: string =
    'You are not authorized to access this page!';
}
