package i5.obd.backend;

//TODO:: JavaDocs

public class Badge{

    private String name;
    
    private String description;
    
    private String imageURI;
    
    private String criteriaURI;
    
    private String criteria;
    
    private String criteriaMachineReadable;
    
    private String issuer;
    
    private String notes;
    
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
    
    public String getName(){
        return this.name;
    }
    
    public String getDescription(){
        return this.description;
    }
    
    public String getImageURI(){
        return this.imageURI;
    }
    
    public String getCriteriaURI(){
        return this.criteriaURI;
    }
    
    public String getCriteria(){
        return this.criteria;
    }
    
    public String getCriteriaMachineReadable(){
        return this.criteriaMachineReadable;
    }
    
    public String getIssuer(){
        return this.issuer;
    }
    
    // Setters
    
    public void setName(String name){
        this.name = name;
    }
    
    public void setDescription(String description){
        this.description = description;
    }
    
    public void setImageURI(String imageURI){
        this.imageURI = imageURI;
    }
    
    public void setCriteriaURI(String criteriaURI){
        this.criteriaURI = criteriaURI;
    }
    
    public void setCriteria(String criteria){
        this.criteria = criteria;
    }
    
    public void setCriteriaMachineReadable(String criteriaMachineReadable){
        this.criteriaMachineReadable = criteriaMachineReadable;
    }
    
    public void setIssuer(String issuer){
        this.issuer = issuer;
    }
    
    public void setNotes(String notes){
        this.notes = notes;
    }

    
//    private String name;
//    
//    private String description;
//    
//    private String imageURI;
//    
//    private String criteriaURI;
//    
//    private String criteria;
//    
//    private String criteriaMachineReadable;
//    
//    private String issuer;
//    
//    private String notes;
    
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
