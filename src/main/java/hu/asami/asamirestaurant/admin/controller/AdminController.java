
package hu.asami.asamirestaurant.admin.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping({"/", "", "/admin"})
@Controller
public class AdminController {

    @GetMapping("/etlap")
    public String getEtlap(){
        return "admin/etlap";
    }

    @GetMapping("/kapcsolat")
    public String getKapcsolat(){
        return "admin/kapcsolat";
    }

    @GetMapping("/galeria")
    public String getGaleria(){
        return "admin/galeria";
    }

    @GetMapping("/rolunk")
    public String getRolunk(){
        return "admin/rolunk";
    }

    @GetMapping("/hetiajanlat")
    public String getHetiajanlat(){
        return "admin/hetiajanlat";
    }

    @GetMapping("/infobox")
    public String getInfobox(){
        return "admin/informacio";
    }

}

