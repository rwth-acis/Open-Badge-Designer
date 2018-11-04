package i5.obd.backend;


/**
 * Class for Badge container objects.
 * 
 * @author Daniel Schruff
 * 
 * @version 0.1
 *
 */
public class Badge{

    private String name;
    
    private String description;
    
    private String imageURI;
    
    private String criteriaURI;
    
    private String criteria;
    
    private String criteriaMachineReadable;
    
    private String issuer;
    
    private String notes;
    
    /**
     * Empty Constructor generating default information.
     */
    public Badge(){
        this.name = "A new Badge";
        this.description = "Earned by fulfilling the criteria!";
        this.imageURI = "http://example.com/badges/a-new-badge.png";
        this.criteriaURI = "http://example.com/badges/a-new-badge-criteria.html";
        this.criteria = "This and that and another thing must be fulfilled.";
        this.criteriaMachineReadable = "";
        this.issuer = "http://example.com/issuers/YOURNAME.json";
        this.notes = "";
    }
    
    
    /**
     * Constructor for a custom badge.
     * 
     * @param name the badge name
     * @param description the description of this badge
     * @param imageURI the URI containing the badge image
     * @param criteriaURI the URI containing the badge criteria
     * @param criteria the criteria text
     * @param criteriaMachineReadable machine readable representation of the machine readable text
     * @param issuer the issuer of this badge
     */
    public Badge(String name, String description, String imageURI, String criteriaURI, String criteria, String criteriaMachineReadable, String issuer){
        this.name = name;
        this.description = description;
        this.imageURI = imageURI;
        this.criteriaURI = criteriaURI;
        this.criteria = criteria;
        this.criteriaMachineReadable = criteriaMachineReadable;
        this.issuer = issuer;
        this.notes = "";
    }
    
    // Getters
    
    /**
     * Getter
     * 
     * @return the name of this badge
     */
    public String getName(){
        return this.name;
    }
    
    /**
     * Getter
     * 
     * @return the description of this badge
     */
    public String getDescription(){
        return this.description;
    }
    
    /**
     * Getter
     * 
     * @return the URI of the image for this badge
     */
    public String getImageURI(){
        return this.imageURI;
    }
    
    /**
     * Getter
     * 
     * @return the URI for the criteria of this badge
     */
    public String getCriteriaURI(){
        return this.criteriaURI;
    }
    
    /**
     * Getter
     * 
     * @return the criteria of this badge
     */
    public String getCriteria(){
        return this.criteria;
    }
    
    /**
     * Getter
     * 
     * @return the criteria of this badge in a machine-readable format
     */
    public String getCriteriaMachineReadable(){
        return this.criteriaMachineReadable;
    }
    
    /**
     * Getter
     * 
     * @return the issuer of this badge
     */
    public String getIssuer(){
        return this.issuer;
    }
    
    // Setters
    
    /**
     * Setter
     * 
     * @param name the name of thisbadge
     */
    public void setName(String name){
        this.name = name;
    }
    
    /**
     * Setter
     * 
     * @param description the description of this badge
     */
    public void setDescription(String description){
        this.description = description;
    }
    
    /**
     * Setter
     * 
     * @param imageURI the URI of the image of this badge
     */
    public void setImageURI(String imageURI){
        this.imageURI = imageURI;
    }
    
    /**
     * Setter
     * 
     * @param criteriaURI the URI for the criteria of this badge
     */
    public void setCriteriaURI(String criteriaURI){
        this.criteriaURI = criteriaURI;
    }
    
    /**
     * Setter
     * 
     * @param criteria the criteria of this badge
     */
    public void setCriteria(String criteria){
        this.criteria = criteria;
    }
    
    /**
     * Setter
     * 
     * @param criteriaMachineReadable the criteria of this badge in a machine-readable format
     */
    public void setCriteriaMachineReadable(String criteriaMachineReadable){
        this.criteriaMachineReadable = criteriaMachineReadable;
    }
    
    /**
     * Setter
     * 
     * @param issuer the issuer of this badge
     */
    public void setIssuer(String issuer){
        this.issuer = issuer;
    }
    
    /**
     * Setter
     * 
     * @param notes additional notes for this badge
     */
    public void setNotes(String notes){
        this.notes = notes;
    }
    
	/**
	 * function to transfer this badge into a JSON conformant String
	 * 
	 * @return the resulting string
	 */
	public String toJSONString() {
		String out = "{";
		out = out + "\"name\":\"" + name + "\",";
		out = out + "\"description\":\"" + description + "\",";
		out = out + "\"imageuri\":\"" + imageURI + "\",";
		out = out + "\"criteriauri\":\"" + criteriaURI + "\",";
		out = out + "\"criteria\":\"" + criteria + "\",";
		out = out + "\"criteriamachinereadable\":\"" + criteriaMachineReadable + "\",";
		out = out + "\"issuer\":\"" + issuer + "\",";
		out = out + "\"notes\":\"" + notes + "\"";
		out = out + "}";
		return out;
	}
    
    
}
