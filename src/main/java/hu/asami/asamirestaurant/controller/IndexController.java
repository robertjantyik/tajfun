package hu.asami.asamirestaurant.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping({"/", "", "/index"})
@Controller
public class IndexController {

    @GetMapping("")
    public String getIndex(){
        return "index";
    }
}
