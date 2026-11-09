import { neon } from '@neondatabase/serverless';
export default async function handler(req,res){
  const sql=neon(process.env.DATABASE_URL);
  await sql`CREATE TABLE IF NOT EXISTS org_content(id int primary key default 1, title text, body text)`;
  await sql`INSERT INTO org_content(id,title,body) VALUES(1,'Organisasi Hasan','Selamat datang di website organisasi.') ON CONFLICT(id) DO NOTHING`;
  if(req.method==='GET'){
    const rows=await sql`SELECT * FROM org_content WHERE id=1`;
    res.status(200).json({ok:true,data:rows[0]});
  } else if(req.method==='POST'){
    const {title,body}=req.body||{};
    const rows=await sql`UPDATE org_content SET title=${title}, body=${body} WHERE id=1 RETURNING *`;
    res.status(200).json({ok:true,data:rows[0]});
  } else {
    res.status(405).json({error:'Method not allowed'});
  }
}
