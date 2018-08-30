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
    
    public void generateBadges(List<Pair> values, boolean groupable, boolean countable, int min_value, int max_value){
        if (countable){
            // add Badge L (reach a sum of XXX values. This is meaningless for timestamps, but works out to "reach an alltime score of 10000" or "kill 5000 sheep")
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
    
}
