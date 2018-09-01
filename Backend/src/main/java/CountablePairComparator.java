package i5.obd.backend;

import java.util.Comparator;

public class CountablePairComparator implements Comparator<Pair>{
    @Override
    public int compare(Pair a, Pair b){
        int i = getInteger(a.getValueX());
        int j = getInteger(b.getValueX());
        if(i == j)
            return 0;
        if(i < j)
            return -1;
        return 1;
    }
    
    private int getInteger(String a){
        int out = Integer.MAX_VALUE;
        try{
            out = Integer.parseInt(a);
        } catch(NumberFormatException nfe){
            System.out.println("Compared String did not contain Integer!");
            System.out.println(a);
            return Integer.MAX_VALUE;
        }
        return out;
    }
}
