package i5.obd.backend;

import java.util.List;
import java.util.ArrayList;
import java.util.Collections;


/**
 * @author Daniel Schruff
 * 
 * version 0.1
 */
public class BadgeGenerator{
	// TODO:: generic BadgeGenerator to allow different methods of recommendation generation
    
    private List<Badge> badges;
    
    /**
     * Constructor for a BadgeGenerator object.
     */
    public BadgeGenerator(){
        this.badges = new ArrayList<Badge>();
    }
    
    /**
     * Getter
     * 
     * @return list of generated badge recommendations
     */
    public List<Badge> getBadges(){
        return badges;
    }
    
    /**
     * function to generate badges based on the given data
     * 
     * @param values list of pairs containing a value and it's frequency in the data set
     * @param key the xAPI key used
     * @param actionID the xAPI action (verb) used
     * @param objectID the xAPI object (activity) used
     * @param groupable boolean specifying whether the data could be grouped into a preset finite set of groups
     * @param countable boolean specifying whether the data was recognised as countable (currently, Integer)
     * @param min_value the minimum value considered. lower will be ignored.
     * @param max_value the maximum value considered. higher will be ignored.
     */
    public void generateBadges(List<Pair> values, String key, String actionID, String objectID,boolean groupable, boolean countable, int min_value, int max_value){
        /*
            countable means we are working under the assumption that the value is an integer number
            where more a higher number actually represents an increase of something.
            The application can not recognise this for certain, so of the countable requirements are
            met, but the numbers actually represent an ENUM or such, the resulting Badge may have no
            meaning.
        */
        if (countable){
            // if the list contains countable integers, it should be sorted, as the numbers will lose their meaning out of order.
            Collections.sort(values, new CountablePairComparator());
            // add Badge L (reach a sum of X values. This is meaningless for timestamps, but works out to "reach an alltime score of 10000" or "kill 5000 sheep")
            addSumBadge(values, key, actionID, objectID);
            /*
                specifically for countable values, it may happen that a very large number of
                different values occur within a dataset. 
                The range could for example be 0 to 1 million.
                As a result, countable numbers need to be either within a certain threshold,
                or get grouped. (e.g. groups for numbers 1-5, 6-10, ...)
            */
            if (groupable){
                // add Badges M, N (increase occur of least (or most, which doesn't sound very useful) common keys)
                addUncommonBadge(values, key, actionID, objectID, true);
                addCommonBadge(values, key, actionID, objectID, true);
            }
            if (min_value < Integer.MAX_VALUE && max_value > Integer.MIN_VALUE){
                // add Badges O, P (increase occur of keys with lowest (or highest) value)
                addHighBadge(values, key, actionID, objectID);
                addLowBadge(values, key, actionID, objectID);
            }
        }else{
            // add Badges M, N (increase occur of least (or most, which doesn't sound very useful) common keys)
            addUncommonBadge(values, key, actionID, objectID, false);
            addCommonBadge(values, key, actionID, objectID, false);
        }
    }
    
    
    /**
     * function to add the 'sum' type badge
     * 
     * @param values given pair data (frequency of values)
     * @param key used xAPI key
     * @param actionID used xAPI action (verb)
     * @param objectID used xAPI object (activity)
     */
    private void addSumBadge(List<Pair> values, String key, String actionID, String objectID){
        int newSum = 0;
        for (Pair pair: values){
            // add value * occurrences to get total sum
            newSum += Integer.parseInt(pair.getValueX()) * pair.getValueY();
        }    
        
        newSum = 3 * newSum;
    
        Badge badge = new Badge();
        badge.setCriteria(String.format("Reach a total SUM of %s on the values of xAPI key %s for action %s on Object %s", newSum, key, actionID, objectID));
        badge.setCriteriaMachineReadable(String.format("object: %s, action: %s, key: %s, condition: SUM[value]>%s, repetitions: 1", objectID, actionID, key, newSum)); 
        //with key X , the sum of all values must be greater than Y once
        badge.setNotes("This Badge is scaled by 3 * the total sum for all included users. This value may be much too large if data for all agents is used for a single user. Please adjust.");
        this.badges.add(badge);
    }
    
    /**
     * function to add the 'uncommon' type badge
     * 
     * @param values given pair data (frequency of values)
     * @param key used xAPI key
     * @param actionID used xAPI action (verb)
     * @param objectID used xAPI object (activity)
     * @param countable boolean to specify whether the data is countable (currently: Integer)
     */
    private void addUncommonBadge(List<Pair> values, String key, String actionID, String objectID, boolean countable){
    // get values in least common range n times
        //int totalOccurrences = 0;
        int min = Integer.MAX_VALUE;
        int max = Integer.MIN_VALUE;
        for (Pair pair: values){
            //totalOccurrences += pair.getValueY();
            if(pair.getValueY() < min)
                min = pair.getValueY();
            if(pair.getValueY() > max)
                max = pair.getValueY();
        }
            
        int uncommonThreshold = ((max-min)/5)+min;
        String first_value = "Nope. Nope. Nope.";
        String last_value = "Not intended to show. Ever.";
        boolean groupStarted = false;
        for (Pair pair: values){
            if (pair.getValueY() < uncommonThreshold){
                if (!groupStarted)
                    first_value = pair.getValueX();
                groupStarted = true;
                last_value = pair.getValueX();
            }else if(groupStarted){
                break;
            }
        }
        if(countable){   
            Badge badge = new Badge();
            badge.setCriteria(String.format("Do Action %s on Object %s with a value between %s and %s on xAPI key %s 3 times.", actionID, objectID, first_value, last_value, key));
            badge.setCriteriaMachineReadable(String.format("object: %s, action: %s, key: %s, condition: value<%s&value>%s, repetitions: 3", objectID, actionID, key, last_value, first_value));
            this.badges.add(badge);
        }else{
            Badge badge = new Badge();
            badge.setCriteria(String.format("Do Action %s on Object %s with a value of %s on xAPI key %s 3 times.", actionID, objectID, first_value, key));
            badge.setCriteriaMachineReadable(String.format("object: %s, action: %s, key: %s, condition: value=%s, repetitions: 3", objectID, actionID, key, first_value));
            this.badges.add(badge);
        }
    }
    
    /**
     * function to add a 'common' type badge
     * 
     * @param values given pair data (frequency of values)
     * @param key used xAPI key
     * @param actionID used xAPI action (verb)
     * @param objectID used xAPI object (activity)
     * @param countable boolean to specify whether the data is countable (currently: Integer)
     */
    private void addCommonBadge(List<Pair> values, String key, String actionID, String objectID, boolean countable){
    // get values in most common range n times
        //int totalOccurrences = 0;
        int min = Integer.MAX_VALUE;
        int max = Integer.MIN_VALUE;
        for (Pair pair: values){
            //totalOccurrences += pair.getValueY();
            if(pair.getValueY() < min)
                min = pair.getValueY();
            if(pair.getValueY() > max)
                max = pair.getValueY();
        }
            
        int commonThreshold = (((max-min)/5)*4)+min;
        String first_value = "This should never show!";
        String last_value = "This should never show!";
        boolean groupStarted = false;
        for (Pair pair: values){
            if (pair.getValueY() > commonThreshold){
                if (!groupStarted)
                    first_value = pair.getValueX();
                groupStarted = true;
                last_value = pair.getValueX();
            }else if(groupStarted){
                break;
            }
        }
        if(countable){
            Badge badge = new Badge();
            badge.setCriteria(String.format("Do Action %s on Object %s with a value between %s and %s on xAPI key %s 3 times.", actionID, objectID, first_value, last_value, key));
            badge.setCriteriaMachineReadable(String.format("object: %s, action: %s, key: %s, condition: value<%s&value>%s, repetitions: 3", objectID, actionID, key, last_value, first_value));
            this.badges.add(badge);
        }else{
            Badge badge = new Badge();
            badge.setCriteria(String.format("Do Action %s on Object %s with a value of %s on xAPI key %s 3 times.", actionID, objectID, first_value, key));
            badge.setCriteriaMachineReadable(String.format("object: %s, action: %s, key: %s, condition: value=%s, repetitions: 3", objectID, actionID, key, first_value));
            this.badges.add(badge);
        }
    }
    
    /**
     * function to add a 'high value' type badge
     * 
     * @param values given pair data (frequency of values)
     * @param key used xAPI key
     * @param actionID used xAPI action (verb)
     * @param objectID used xAPI object (activity)
     */
    private void addHighBadge(List<Pair> values, String key, String actionID, String objectID){
    // get values above X n times. (increase occur of highest values)
        //int totalSum = 0;
        int min = Integer.MAX_VALUE;
        int max = Integer.MIN_VALUE;
        for (Pair pair: values){
            int val_x = Integer.parseInt(pair.getValueX());
            //totalSum += val_x;
            if(val_x < min)
                min = val_x;
            if(val_x > max)
                max = val_x;
        }
            
        int highThreshold = (((max-min)/5)*4)+min;
        String first_value = "ThisShouldNeverShow";
        String last_value = "ThisValueMeansError";
        boolean groupStarted = false;
        for (Pair pair: values){
            int val_x = Integer.parseInt(pair.getValueX());
            if (val_x > highThreshold){
                if (!groupStarted)
                    first_value = pair.getValueX();
                groupStarted = true;
                last_value = pair.getValueX();
            }else if(groupStarted){
                break;
            }
        }
           
        Badge badge = new Badge();
        badge.setCriteria(String.format("Do Action %s on Object %s with a value between %s and %s on xAPI key %s 3 times.", actionID, objectID, first_value, last_value, key));
        badge.setCriteriaMachineReadable(String.format("object: %s, action: %s, key: %s, condition: value<%s&value>%s, repetitions: 3", objectID, actionID, key, last_value, first_value));
        this.badges.add(badge);
    }
    
    /**
     * function to add a 'low value' type badge
     * 
     * @param values given pair data (frequency of values)
     * @param key used xAPI key
     * @param actionID used xAPI action (verb)
     * @param objectID used xAPI object (activity)
     */
    private void addLowBadge(List<Pair> values, String key, String actionID, String objectID){
    // get values below X n times (increase occur of lowest values)
        //int totalSum = 0;
        int min = Integer.MAX_VALUE;
        int max = Integer.MIN_VALUE;
        for (Pair pair: values){
            int val_x = Integer.parseInt(pair.getValueX());
            //totalSum += val_x;
            if(val_x < min)
                min = val_x;
            if(val_x > max)
                max = val_x;
        }
            
        int lowThreshold = ((max-min)/5)+min;
        String first_value = "SomethingWentWrong";
        String last_value = "PleaseConsiderContactingSomeone";
        boolean groupStarted = false;
        for (Pair pair: values){
            int val_x = Integer.parseInt(pair.getValueX());
            if (val_x < lowThreshold){
                if (!groupStarted)
                    first_value = pair.getValueX();
                groupStarted = true;
                last_value = pair.getValueX();
            }else if(groupStarted){
                break;
            }
        }
        
        Badge badge = new Badge();
        badge.setCriteria(String.format("Do Action %s on Object %s with a value between %s and %s on xAPI key %s 3 times.", actionID, objectID, first_value, last_value, key));
        badge.setCriteriaMachineReadable(String.format("object: %s, action: %s, key: %s, condition: value<%s&value>%s, repetitions: 3", objectID, actionID, key, last_value, first_value));
        this.badges.add(badge);
    }
}
