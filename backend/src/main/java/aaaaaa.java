/*
public class Hello {
    public static void main(String[] args) {
        if (args.length > 0) {
            for (String arg : args) {
                System.out.print(arg+"hihi");
            }
        } else {
            System.out.println("인자가 전달되지 않았습니다.");
        }
    }
}
*/

/*
public class Hello {
    public static void main(String[] args) {
        System.out.println("hi");
    }
}
*/
/*
public class Hello {
    public static void main(String[] args) {
        String input = args[0];
        String output = "";

        if (input.equals("test1")) {
            output = "answer1";
        } else if (input.equals("test2")) {
            output = "answer2";
        } else if (input.equals("test3")) {
            output = "answer3";
        } else if (input.equals("test4")) {
            output = "answer4";
        } else if (input.equals("test5")) {
            output = "answer5";
        } else {
            output = "Invalid test input";
        }
        System.out.println(output);
    }
}

*/


/*
public class Hello {
    public static void main(String[] args) {
        for (int i = 0; i < args.length - 1; i++) {
            for (int j = i + 1; j < args.length; j++) {
                if (args[i].compareTo(args[j]) > 0) {
                    // args[i]와 args[j]를 교환합니다.
                    String temp = args[i];
                    args[i] = args[j];
                    args[j] = temp;
                }
            }
        }
        for (String arg : args) {
            System.out.print(arg + " ");
        }
    }
}
*/

/*public class Hello {
    public static void main(String[] args) {
        for (int i = 0; i < args.length - 1; i = Integer.sum(i, 1)) {
            for (int j = Integer.sum(i, 1); j < args.length; j = Integer.sum(j, 1)) {
                if (args[i].compareTo(args[j]) > 0) {
                    String temp = args[i]; args[i] = args[j]; args[j] = temp;
                }
            }
        } for (int k = 0; k < args.length; k = Integer.sum(k, 1)) {
            System.out.print(args[k]); System.out.print(" "); }
    }
}*/

