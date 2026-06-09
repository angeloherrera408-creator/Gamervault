package com.gamevault;

import com.gamevault.model.Producto;
import com.gamevault.repository.ProductoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class GameVaultApplication {

    public static void main(String[] args) {
        SpringApplication.run(GameVaultApplication.class, args);
    }

    @Bean
    CommandLineRunner initDatabase(ProductoRepository repository) {
        return args -> {
            repository.save(new Producto("Cyber World 2077", "Juego", 39.99, 40, "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=400"));
            repository.save(new Producto("Fantasy Realms", "Juego", 19.99, 15, "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=400"));
            repository.save(new Producto("Neon Racer", "Juego", 29.99, 30, "https://images.unsplash.com/photo-1614294149010-950b698f72c0?auto=format&fit=crop&q=80&w=400"));
            repository.save(new Producto("GR270033 Dreizt RGB PRO", "Hardware", 49.99, 35, "https://www.dreiztgamer.com/cdn/shop/files/soporte-audifonos-gamer-dreizt-rgb-pro_064630f3-a01b-4c1f-81e0-c3015782d63c.jpg?v=1752099658"));
            repository.save(new Producto("TKL 64 Teclas RainbowLED", "Hardware", 17.99, 25, "https://pe-media.hptiendaenlinea.com/magefan_blog/Teclados_mec_nicos_todo_lo_que_necesit_s_saber.jpg"));
            repository.save(new Producto("mouse logitech", "Hardware", 15.99, 20, "https://hiraoka.com.pe/media/mageplaza/blog/post/l/o/logitech-mejores_accesorios_de_computo_y_gaming.jpg"));
            System.out.println(">> Base de Datos H2 inicializada con productos corporativos.");
        };
    }
}