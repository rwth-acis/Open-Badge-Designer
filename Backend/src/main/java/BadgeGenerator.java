package i5.obd.backend;

import java.util.List;
import java.util.ArrayList;

//TODO:: Javadocs
//TODO:: Abstraction

public class BadgeGenerator{
    
    private List<Badge> badges;
    
    public BadgeGenerator(){
        this.badges = new ArrayList<Badge>();
    }
    
    public void generateBadges(List<Pair> values, String key, boolean groupable, boolean countable, int min_value, int max_value){
        /*
            countable means we are working under the assumption that the value is an integer number
            where more a higher number actually represents an increase of something.
            The application can not recognise this for certain, so of the countable requirements are
            met, but the numbers actually represent an ENUM or such, the resulting Badge may have no
            meaning.
        */
        if (countable){
            // add Badge L (reach a sum of XXX values. This is meaningless for timestamps, but works out to "reach an alltime score of 10000" or "kill 5000 sheep")
            addSumBadge(values, key);
            /*
                specifically for countable values, it may happen that a very large number of
                different values occur within a dataset. 
                The range could for example be 0 to 1 million.
                As a result, countable numbers need to be either within a certain threshold,
                or get grouped. (e.g. groups for numbers 1-5, 6-10, ...)
            */
            if (groupable){
                // add Badges M, N (increase occur of least (or most, which doesn't sound very useful) common keys)
            }
            if (min_value < Integer.MAX_VALUE && max_value > Integer.MIN_VALUE){
                // add Badges O, P (increase occur of keys with lowest (or highest) value)
            }
        }else{
            // add Badges M, N (increase occur of least (or most, which doesn't sound very useful) common keys)
        }
    }
    
    /*
        Quintiles of...:
        (Max-Min) -> width , for occurrence: SUM_of_all_occurrence_counts
        (width/5) -> width of first quintile , check which values are in it
    */
    
    private Badge addSumBadge(List<Pair> values, key){
        int newSum = 0;
        for (Pair pair: values){
            // add value * occurrences to get total sum
            newSum += pair.getX() * pair.getY()
        }    
        
        newSum = 3 * newSum;
    
        Badge badge = new Badge();
        badge.setCriteria("Reach a total SUM of %s on the values of xAPI key %s" % (key));
        badge.setCriteriaMachineReadable("%s,SUM[value]>%s,1" % (key, newSum)); //with key X , the sum of all values must be greater than Y once
        badge.setNotes("This Badge is scaled by 3 * the total sum for all included users. This value may be much too large if data for all agents is used for a single user. Please adjust.");
    }
    
    private Badge addUncommonBadge(List<Pair> values, key){
    // get values in least common range n times
    }
    
    private Badge addCommonBadge(List<Pair> values, key){
    // get values in most common range n times
    }
    
    private Badge addHighBadge(List<Pair> values, key){
    // get values above X n times. (increase occur of highest values)
    }
    
    private Badge addLowBadge(List<Pair> values, key){
    // get values below X n times (increase occur of lowest values)
   
    
    }
    
}
