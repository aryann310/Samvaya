import tls from 'tls';
/**
 * TLS 1.2+ Database Connection Configuration.
 * Enforces TLS 1.2 minimum version and rejects unauthorized certificates.
 */
export interface DatabaseTlsOptions {
    ssl: {
        minVersion: 'TLSv1.2' | 'TLSv1.3';
        rejectUnauthorized: boolean;
        ca?: string | undefined;
        key?: string | undefined;
        cert?: string | undefined;
        checkServerIdentity?: ((hostname: string, cert: tls.PeerCertificate) => Error | undefined) | undefined;
    };
}
/**
 * Generates secure database SSL configuration enforcing TLS 1.2+
 */
export declare function getDatabaseTlsConfig(): DatabaseTlsOptions;
/**
 * At-Rest Full Volume/Disk Encryption Specification (AES-256).
 *
 * For cloud databases (AWS RDS, Aurora, EBS volumes, MongoDB Atlas, Azure Database):
 * - AWS KMS CMK with AES-256 encryption algorithm is enforced on the storage volume.
 * - For self-hosted Linux database hosts:
 *   LUKS2 dm-crypt with AES-256-XTS (aes-xts-plain64, 512-bit key).
 * - For PostgreSQL TDE / Transparent Data Encryption:
 *   Cluster data files encrypted with AES-256.
 */
export declare const AT_REST_DISK_ENCRYPTION_SPEC: {
    standard: string;
    modes: {
        awsKms: string;
        linuxLuks: string;
        postgresqlTde: string;
    };
    status: string;
};
//# sourceMappingURL=dbSsl.d.ts.map